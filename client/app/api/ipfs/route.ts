import { NextResponse, type NextRequest } from 'next/server'
import { pinata } from '@/lib/web3/pinata';

export async function POST(request: NextRequest) {
    try {
        const metadata = await request.json();
        const { cid } = await pinata.upload.public.json(metadata);
        const url = await pinata.gateways.public.convert(cid);

        return NextResponse.json(url, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Internal Server Error'},
            { status: 500 }
        )
    }
}