'use client';

import { useEffect, type FC } from 'react';

const isBlockedKey = (event: KeyboardEvent) => {
    const key = String(event.key || '').toLowerCase();
    const isF12 = event.key === 'F12' || event.code === 'F12' || event.keyCode === 123;
    const inspectCombo =
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        (key === 'i' || key === 'j' || key === 'c' || key === 'k');
    const macInspect = event.metaKey && event.altKey && (key === 'i' || key === 'j' || key === 'c');
    const viewSource = (event.ctrlKey || event.metaKey) && key === 'u';
    return isF12 || inspectCombo || macInspect || viewSource;
};

const DisableDevtool: FC = () => {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!isBlockedKey(event)) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
        };

        const onContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        window.addEventListener('keydown', onKeyDown, true);
        window.addEventListener('keyup', onKeyDown, true);
        window.addEventListener('contextmenu', onContextMenu, true);

        let cancelled = false;
        import('disable-devtool').then((mod) => {
            if (cancelled) {
                return;
            }
            const disableDevtool = mod.default;
            disableDevtool({
                disableMenu: true,
                url: 'about:blank',
                timeOutUrl: 'about:blank',
                clearLog: true,
                disableSelect: false,
                disableCopy: false,
                disableCut: false,
                disablePaste: false
            });
        });

        return () => {
            cancelled = true;
            window.removeEventListener('keydown', onKeyDown, true);
            window.removeEventListener('keyup', onKeyDown, true);
            window.removeEventListener('contextmenu', onContextMenu, true);
        };
    }, []);

    return null;
};

export default DisableDevtool;
