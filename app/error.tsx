"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
    return(
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <h2 className="text-lg font-medium">Something went wrong</h2>
            <Link href="/documents">
                <Button>Go back</Button>
            </Link>
        </div>
    )
}

export default ErrorPage;
