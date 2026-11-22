# PrivacyBlur

A lightweight privacy plugin for [Vencord](https://vencord.dev/) that blurs Discord's content area, keeping the title bar visible.

## Features

- **Quick toggle** – Enable or disable privacy blur using a button in the Discord title bar.
- **Custom blur strength** – Adjust the blur amount to your preference.
- **Keyboard shortcut** – Optionally configure a keyboard shortcut to toggle the blur.
- **Lightweight** – Simple, on-demand blur without unnecessary background features.

## Installation

1. Install [Vencord](https://vencord.dev/).
2. Download or clone this repository.
3. Place the plugin folder in your Vencord `src/userplugins` directory.
4. Build and inject Vencord.
5. Enable **PrivacyBlur** in Vencord's plugin settings.

## Configuration

PrivacyBlur includes the following settings:

| Setting | Description |
|---|---|
| Keybind | Optional keyboard shortcut for toggling blur. |
| Blur Amount | Adjusts the strength of the blur effect. |

You can also toggle the effect using the button in Discord's title bar.

## Screenshots

### Privacy Blur disabled
![Privacy Blur disabled](screenshots/blur-disabled.png)

### Privacy Blur enabled
![Privacy Blur enabled](screenshots/blur-enabled.png)

### Plugin settings
![Privacy Blur settings](screenshots/plugin-settings.png)

## Compatibility

Designed for Vencord. Compatibility with other Discord clients or plugin systems is not guaranteed.

## Licence

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
