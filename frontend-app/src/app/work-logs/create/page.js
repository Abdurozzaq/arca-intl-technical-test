import { Suspense } from 'react';
import CreateWorkLog from './CreateWorkLogContent';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading work log form...</div>}>
            <CreateWorkLog />
        </Suspense>
    );
}