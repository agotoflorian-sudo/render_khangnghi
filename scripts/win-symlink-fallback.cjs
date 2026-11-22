const fs = require('fs');
const path = require('path');

const copyInstead = (target, dest) => {
    const from = path.resolve(path.dirname(dest), target);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
        fs.symlinkSync(from, dest, 'junction');
        return;
    } catch {
        fs.cpSync(from, dest, { recursive: true, force: true });
    }
};

const wrapSync = (original) =>
    function symlinkSync(target, dest, type) {
        try {
            return original.call(this, target, dest, type);
        } catch (error) {
            if (error?.code === 'EEXIST') return;
            if (error?.code === 'EPERM' || error?.code === 'ENOTSUP') {
                copyInstead(target, dest);
                return;
            }
            throw error;
        }
    };

const wrapCallback = (original) =>
    function symlink(target, dest, type, callback) {
        const cb = typeof type === 'function' ? type : callback;
        const linkType = typeof type === 'function' ? undefined : type;
        return original.call(this, target, dest, linkType, (error) => {
            if (!error || error.code === 'EEXIST') {
                cb?.(error?.code === 'EEXIST' ? null : error);
                return;
            }
            if (error.code === 'EPERM' || error.code === 'ENOTSUP') {
                try {
                    copyInstead(target, dest);
                    cb?.(null);
                } catch (copyError) {
                    cb?.(copyError);
                }
                return;
            }
            cb?.(error);
        });
    };

fs.symlinkSync = wrapSync(fs.symlinkSync.bind(fs));
fs.symlink = wrapCallback(fs.symlink.bind(fs));

if (fs.promises?.symlink) {
    const originalPromise = fs.promises.symlink.bind(fs.promises);
    fs.promises.symlink = async (target, dest, type) => {
        try {
            return await originalPromise(target, dest, type);
        } catch (error) {
            if (error?.code === 'EEXIST') return;
            if (error?.code === 'EPERM' || error?.code === 'ENOTSUP') {
                copyInstead(target, dest);
                return;
            }
            throw error;
        }
    };
}
