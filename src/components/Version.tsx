import { actions } from '@/lib';
import { useEffect, useState } from 'react';

export const prerender = false;

export function Version() {
    const [version, useVersion] = useState('');
    useEffect(() => {
        actions.getLatestVersion().then((r) => useVersion(r.version));
    }, []);

    return <>{version}</>
}