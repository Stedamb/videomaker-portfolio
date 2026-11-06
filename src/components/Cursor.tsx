import { useEffect, useRef } from 'react';

/** Elements that enlarge the cursor. */
const HOVER_SELECTOR = '.cursor-hover, a, button, [role="button"]';
/** Media elements that show a play/pause icon reflecting their real state. */
const PLAY_PAUSE_SELECTOR = '.play-pause';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/** Share of the remaining distance the ring covers per 60 fps frame (frame-rate independent). */
const RING_FOLLOW = 0.3;
const FRAME_MS = 1000 / 60;

type Mode = 'default' | 'hover' | 'play' | 'pause';

/**
 * Custom cursor: a dot that tracks the pointer exactly and a ring that trails it.
 * Only active on devices with a precise, hover-capable pointer; the native cursor is
 * hidden only while it is active. State lives in data attributes; visuals are pure CSS
 * (src/styles/components/cursor.css).
 */
const Cursor = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const ring = ringRef.current;
        const dot = dotRef.current;
        if (!root || !ring || !dot) return;

        const finePointer = window.matchMedia(FINE_POINTER);
        const reducedMotion = window.matchMedia(REDUCED_MOTION);
        const html = document.documentElement;

        const pointer = { x: 0, y: 0 };
        const ringPos = { x: 0, y: 0 };
        let hasPosition = false;
        let frame = 0;
        let lastTime = 0;
        let target: Element | null = null;

        const place = (el: HTMLElement, x: number, y: number) => {
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };

        // Ring easing loop: runs only while the ring is catching up, then stops.
        const tick = (time: number) => {
            const dt = lastTime ? Math.min(time - lastTime, 64) : FRAME_MS;
            lastTime = time;
            const k = reducedMotion.matches ? 1 : 1 - Math.pow(1 - RING_FOLLOW, dt / FRAME_MS);
            ringPos.x += (pointer.x - ringPos.x) * k;
            ringPos.y += (pointer.y - ringPos.y) * k;

            if (Math.abs(pointer.x - ringPos.x) < 0.1 && Math.abs(pointer.y - ringPos.y) < 0.1) {
                ringPos.x = pointer.x;
                ringPos.y = pointer.y;
                place(ring, ringPos.x, ringPos.y);
                frame = 0;
                lastTime = 0;
                return;
            }
            place(ring, ringPos.x, ringPos.y);
            frame = requestAnimationFrame(tick);
        };

        const startLoop = () => {
            if (!frame) frame = requestAnimationFrame(tick);
        };

        const updateMode = () => {
            let mode: Mode = 'default';
            if (target) {
                const media = target.closest(PLAY_PAUSE_SELECTOR);
                mode = media instanceof HTMLMediaElement ? (media.paused ? 'play' : 'pause') : 'hover';
            }
            if (root.dataset.mode !== mode) root.dataset.mode = mode;
        };

        const setTarget = (el: Element | null) => {
            target = el?.closest(HOVER_SELECTOR) ?? null;
            updateMode();
        };

        const retarget = () => {
            if (hasPosition) setTarget(document.elementFromPoint(pointer.x, pointer.y));
        };

        const setVisible = (visible: boolean) => {
            root.dataset.visible = String(visible);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (!hasPosition) {
                // First move: start the ring at the pointer instead of flying in from a corner.
                hasPosition = true;
                ringPos.x = pointer.x;
                ringPos.y = pointer.y;
                place(ring, ringPos.x, ringPos.y);
            }
            place(dot, pointer.x, pointer.y);
            setVisible(true);
            setTarget(e.target as Element | null);
            startLoop();
        };

        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType === 'mouse') root.dataset.pressed = 'true';
        };
        const onPointerUp = () => {
            root.dataset.pressed = 'false';
        };
        const onLeave = () => setVisible(false);
        const onEnter = () => hasPosition && setVisible(true);

        // Media events don't bubble, so listen in the capture phase.
        const onMediaChange = (e: Event) => {
            if (target && target.closest(PLAY_PAUSE_SELECTOR) === e.target) updateMode();
        };

        let scrollQueued = false;
        const onScroll = () => {
            if (scrollQueued) return;
            scrollQueued = true;
            requestAnimationFrame(() => {
                scrollQueued = false;
                retarget();
            });
        };

        const listeners: [EventTarget, string, EventListener, AddEventListenerOptions?][] = [
            [window, 'pointermove', onPointerMove as EventListener, { passive: true }],
            [window, 'pointerdown', onPointerDown as EventListener, { passive: true }],
            [window, 'pointerup', onPointerUp, { passive: true }],
            [window, 'blur', onLeave],
            [html, 'mouseleave', onLeave],
            [html, 'mouseenter', onEnter],
            [window, 'scroll', onScroll, { passive: true, capture: true }],
            [document, 'play', onMediaChange, { capture: true }],
            [document, 'pause', onMediaChange, { capture: true }],
            // Content under the pointer changes after a client-side navigation.
            [document, 'astro:after-swap', retarget],
        ];

        let enabled = false;
        const enable = () => {
            if (enabled) return;
            enabled = true;
            html.classList.add('has-custom-cursor');
            listeners.forEach(([t, type, fn, opts]) => t.addEventListener(type, fn, opts));
        };
        const disable = () => {
            if (!enabled) return;
            enabled = false;
            html.classList.remove('has-custom-cursor');
            listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
            cancelAnimationFrame(frame);
            frame = 0;
            hasPosition = false;
            setVisible(false);
        };

        const sync = () => (finePointer.matches ? enable() : disable());
        sync();
        finePointer.addEventListener('change', sync);

        return () => {
            finePointer.removeEventListener('change', sync);
            disable();
        };
    }, []);

    return (
        <div ref={rootRef} className="Cursor" data-mode="default" data-visible="false" data-pressed="false" aria-hidden="true">
            <div ref={ringRef} className="Cursor-track">
                <div className="Cursor-ring">
                    <svg className="Cursor-icon Cursor-icon--play" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                    <svg className="Cursor-icon Cursor-icon--pause" viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
                </div>
            </div>
            <div ref={dotRef} className="Cursor-track">
                <div className="Cursor-dot" />
            </div>
        </div>
    );
};

export default Cursor;
