import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { useEffect, useState } from "@webpack/common";
import type { PropsWithChildren } from "react";

const HeaderBarIcon = findComponentByCodeLazy(
    ".HEADER_BAR_BADGE_BOTTOM,",
    'position:"bottom"'
);

const CHANGE_EVENT = "vc-privacy-blur-change";

let blurEnabled = false;

const settings = definePluginSettings({
    keybind: {
        type: OptionType.STRING,
        description: "Optional keyboard shortcut, e.g. Ctrl+Shift+B. Leave blank to disable.",
        default: "",
        placeholder: "Ctrl+Shift+B"
    },
    blurAmount: {
        type: OptionType.SLIDER,
        description: "Amount of blur applied to the Discord window.",
        markers: [4, 8, 12, 16, 20, 24],
        default: 12,
        onChange: value => {
            document.documentElement.style.setProperty(
                "--vc-privacy-blur-amount",
                `${value}px`
            );
        }
    }
});

function setBlur(enabled: boolean) {
    blurEnabled = enabled;

    document.body?.classList.toggle("vc-privacy-blur", enabled);
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

function toggleBlur() {
    setBlur(!blurEnabled);
}

function PrivacyIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="vc-privacy-blur-icon"
        >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function PrivacyBlurButton() {
    const [enabled, setEnabled] = useState(blurEnabled);

    useEffect(() => {
        const update = () => setEnabled(blurEnabled);

        window.addEventListener(CHANGE_EVENT, update);
        return () => window.removeEventListener(CHANGE_EVENT, update);
    }, []);

    return (
        <HeaderBarIcon
            className="vc-privacy-blur-btn"
            onClick={toggleBlur}
            tooltip={enabled ? "Disable Privacy Blur" : "Enable Privacy Blur"}
            icon={() => <PrivacyIcon />}
            selected={enabled}
        />
    );
}

function matchesKeybind(event: KeyboardEvent, shortcut: string) {
    const parts = shortcut.toLowerCase().split("+").map(p => p.trim()).filter(Boolean);
    const key = parts.pop();

    if (!key) return false;

    const ctrl = parts.includes("ctrl") || parts.includes("control");
    const shift = parts.includes("shift");
    const alt = parts.includes("alt");
    const meta = parts.includes("meta") || parts.includes("cmd") || parts.includes("command");

    if (
        event.ctrlKey !== ctrl ||
        event.shiftKey !== shift ||
        event.altKey !== alt ||
        event.metaKey !== meta
    ) return false;

    const pressed = event.key.toLowerCase();
    return pressed === (key === "space" ? " " : key);
}

export default definePlugin({
    name: "PrivacyBlur",
    description: "Blurs the Discord window content with a title-bar toggle.",
    tags: ["Utility", "Privacy"],
    authors: [
    {
        name: "nosamayy",
        id: 1001379555795283989n
    }
],

    settings,

    patches: [
        {
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /(trailing:.{0,50}?)\i\.Fragment,(?=\{children:\[)/,
                replace: "$1$self.TrailingWrapper,"
            }
        }
    ],

    start() {
        document.documentElement.style.setProperty(
            "--vc-privacy-blur-amount",
            `${settings.store.blurAmount}px`
        );

        document.addEventListener("keydown", this.onKeyDown);
    },

    stop() {
        document.removeEventListener("keydown", this.onKeyDown);
        setBlur(false);
        document.documentElement.style.removeProperty("--vc-privacy-blur-amount");
    },

    onKeyDown(event: KeyboardEvent) {
        const target = event.target;

        if (
            target instanceof HTMLElement &&
            (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
        ) return;

        if (event.repeat) return;

        const shortcut = settings.store.keybind.trim();
        if (!shortcut || !matchesKeybind(event, shortcut)) return;

        event.preventDefault();
        toggleBlur();
    },

    TrailingWrapper({ children }: PropsWithChildren) {
        return (
            <>
                {children}
                <ErrorBoundary key="vc-privacy-blur" noop>
                    <PrivacyBlurButton />
                </ErrorBoundary>
            </>
        );
    }
});