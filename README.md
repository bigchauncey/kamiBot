# kamiBot by [minters](https://x.com/mintersdev)

kamiBot is an automated script designed to keep your kamis alive during harvesting by constantly monitoring their HP and feeding them with Maple-Flavor Ghost Gum at optimal times to maximize efficiency.

## Features

- Automatic HP monitoring every 180 seconds
- Smart feeding system that triggers when kamis are missing 25 HP or more
- Automatic emergency evacuation system
- Built-in desynchronization detection
- Feeding verification system
- Visual HP tracking with red indicators
- Pause/Resume functionality
- Clean termination option

## Safety Features

kamiBot is equipped with multiple safety checks to prevent your kami from dying:
- Automatic emergency evacuation if:
  - You run out of Maple-Flavor Ghost Gum
  - Game client stops receiving HP updates (desynchronization detection)
  - Feeding fails to increase HP
- HP history tracking to detect client-side issues
- Double-feed prevention mechanism

## Prerequisites

The bot works best under these conditions:
* Single account usage (avoid multiple account gameplay)
* Game page remains active (not minimized)
* Stable internet connection

### Required Window Setup
For full functionality, always keep these windows open:
* "Party" window
* "Harvesting" window

## Installation

1. **Review the Code**: Read and understand the code before using it. This is crucial for your kamis' safety.
2. **Create Bookmark**:
   - Create a new Chrome bookmark
   - Name it "kamiBot" (or your preferred name)
   - Paste the minified code as the bookmark URL
3. **Usage**:
   - Open kamigotchi
   - Ensure required windows are open
   - Click the bookmark to start the bot
   - The Party window will show new control buttons:
     - Pause Bot: Temporarily stop bot operations
     - Terminate Bot: Completely stop the bot and clean up
     - Evacuate All Kamis: Manually trigger emergency evacuation

## Interface

After activation, kamiBot adds:
- Timer showing next HP scan countdown
- Missing HP indicators next to each kami
- Control buttons for bot management
- Evacuation status messages when triggered

## Logging

kamiBot provides detailed console logging for:
- HP scans and changes
- Feeding attempts and results
- Emergency evacuations and reasons
- Desynchronization detection
- General bot operations

## ⚠️ Disclaimer

Please note that this bot is experimental. Despite our best efforts:
- Bugs might occur that could result in kami death
- Maple-Flavor Ghost Gum might be used suboptimally
- Frontend desynchronization might happen
- Use at your own risk

## Known Limitations

- Requires active browser window
- May have increased resource usage due to constant monitoring
- Performance might vary based on browser and system resources
- Not recommended for multi-account usage
- All kamis must be harvesting. If any of them rests, bot will stop working after an hour, because of thinking that HP isn't updating and something broke in the UI

## Troubleshooting

If the bot isn't working as expected:
1. Check console logs for errors
2. Ensure all required windows are open
3. Verify Maple-Flavor Ghost Gum is available
4. Try refreshing the page and restarting the bot

## Contributing

Feel free to submit issues and pull requests to help improve KamiBot.
