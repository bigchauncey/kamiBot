javascript:(function() {
    var partyDiv = document.getElementById("party");
    if (!partyDiv) {
        console.log("No 'party' div found.");
        return;
    }

    var partyTitleDiv = Array.from(partyDiv.querySelectorAll("div")).find(div => div.textContent.trim() === "Party");
    if (partyTitleDiv) {
        var botTitleDiv = document.createElement("div");
        botTitleDiv.style.cssText = "margin-bottom: 10px; font-size: 12px; margin-left: 10px";

        var kamiBotLink = document.createElement("a");
        kamiBotLink.href = "https://github.com/mintersdev/kamiBot";
        kamiBotLink.target = "_blank";
        kamiBotLink.textContent = "kamiBot";
        kamiBotLink.style.cssText = "color: #5bc0de; text-decoration: none;";
        
        var byText = document.createTextNode(" by ");
        
        var mintersLink = document.createElement("a");
        mintersLink.href = "https://x.com/mintersdev";
        mintersLink.target = "_blank";
        mintersLink.textContent = "minters";
        mintersLink.style.cssText = "color: #5bc0de; text-decoration: none;";
        
        botTitleDiv.appendChild(kamiBotLink);
        botTitleDiv.appendChild(byText);
        botTitleDiv.appendChild(mintersLink);
        
        partyTitleDiv.appendChild(botTitleDiv);

        var countdownSpan = document.createElement("span");
        countdownSpan.id = "countdown-timer";
        countdownSpan.style.cssText = "display: inline-block; margin-left: 10px; margin-top: -5px; color: black; font-weight: bold;";
        partyTitleDiv.appendChild(countdownSpan);

        var evacuationReasonSpan = document.createElement("span");
        evacuationReasonSpan.id = "evacuation-reason";
        evacuationReasonSpan.style.cssText = "display: block; margin-top: 5px; color: #5bc0de; font-weight: bold;";
        partyTitleDiv.appendChild(evacuationReasonSpan);

        var buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = "display: flex; gap: 5px; margin-top: 5px;";

        var pauseButton = document.createElement("button");
        pauseButton.textContent = "Pause Bot";
        pauseButton.style.cssText = "background-color:#f0ad4e; color:white; border:none; padding:5px 10px; cursor:pointer; font-family:monospace;";
        buttonContainer.appendChild(pauseButton);

        var terminateButton = document.createElement("button");
        terminateButton.textContent = "Terminate Bot";
        terminateButton.style.cssText = "background-color:#d9534f; color:white; border:none; padding:5px 10px; cursor:pointer; font-family:monospace;";
        buttonContainer.appendChild(terminateButton);

        var evacuateButton = document.createElement("button");
        evacuateButton.textContent = "Evacuate All Kamis";
        evacuateButton.style.cssText = "background-color:#5bc0de; color:white; border:none; padding:5px 10px; cursor:pointer; font-family:monospace;";
        buttonContainer.appendChild(evacuateButton);

        partyTitleDiv.appendChild(buttonContainer);
    }

    var isPaused = false;
    var scanInterval;
    var countdownInterval;
    var kamiHPData = {};
    var lastFedHP = {};

    function logToConsole(message) {
        var now = new Date();
        var time = now.toTimeString().split(" ")[0];
        console.log(`[kamiBot][${time}] ${message}`);
    }

    function startCountdown(duration) {
        var countdownTime = duration;
        countdownSpan.textContent = `(Next scan in: ${countdownTime}s)`;

        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(function() {
            if (isPaused) {
                clearInterval(countdownInterval);
                return;
            }
            countdownTime -= 1;
            countdownSpan.textContent = `(Next scan in: ${countdownTime}s)`;

            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function getCleanKamiName(nameElement) {
        return nameElement.textContent.trim().replace(/-\d+$/, '');
    }

    function updateKamiHP(kamiName, newHp) {
        var cleanName = kamiName.replace(/-\d+$/, '');
        
        if (!kamiHPData[cleanName]) {
            kamiHPData[cleanName] = [];
        }

        kamiHPData[cleanName].push(newHp);

        if (kamiHPData[cleanName].length > 20) {
            kamiHPData[cleanName].shift();
        }
    }

    function showEvacuationReason(reason) {
        evacuationReasonSpan.textContent = `Kamis evacuated, reason: ${reason}`;
    }

    function checkDesynchronization() {
        for (let kamiName in kamiHPData) {
            var hpHistory = kamiHPData[kamiName];
            if (hpHistory.length === 20 && hpHistory.every(hp => hp === hpHistory[0])) {
                logToConsole(`Desynchronization detected for ${kamiName}. Initiating evacuation.`);
                logToConsole(`HP history for ${kamiName}: ${hpHistory.join(", ")}`);
                evacuateAllKamis("Frontend desynchronization detected");
                break;
            }
        }
    }

    function feedKami(kamiDiv, kamiName, currentHp) {
        var cleanName = kamiName.replace(/-\d+$/, '');
        
        if (lastFedHP[cleanName] !== undefined) {
            logToConsole(`Checking HP after feeding ${kamiName}`);
            logToConsole(`HP before feeding: ${lastFedHP[cleanName]}, Current HP: ${currentHp}`);
            
            if (currentHp <= lastFedHP[cleanName]) {
                logToConsole(`WARNING: HP did not increase after feeding! Before: ${lastFedHP[cleanName]}, Now: ${currentHp}`);
                evacuateAllKamis("Feeding failure detected - possible desynchronization");
                return;
            } else {
                logToConsole(`HP increased successfully after feeding (${lastFedHP[cleanName]} -> ${currentHp})`);
                lastFedHP[cleanName] = undefined;
            }
        }

        var feedButton = kamiDiv.querySelector('span[aria-label="Feed Kami"] button');
        if (feedButton) {
            logToConsole(`Found feed button for ${kamiName}: ${feedButton.id || feedButton.className || "No ID/unique class"}`);
            logToConsole(`Initiating feeding sequence. Current HP: ${currentHp}`);
            feedButton.click();
            logToConsole("Clicked feed button for kami");

            setTimeout(function() {
                var gumFound = false;
                document.querySelectorAll("div").forEach(function(div) {
                    if (div.textContent.includes("Maple-Flavor Ghost Gum (+25hp)")) {
                        div.click();
                        gumFound = true;
                        lastFedHP[cleanName] = currentHp;
                        logToConsole(`Fed ${kamiName} with Maple-Flavor Ghost Gum. HP before feeding: ${currentHp}`);
                    }
                });

                if (!gumFound) {
                    logToConsole("Maple-Flavor Ghost Gum not found in the item list. Initiating evacuation due to no more food.");
                    evacuateAllKamis("No more food");
                }
            }, 500);
        } else {
            logToConsole(`Feed button not found for ${kamiName}`);
        }
    }

    function checkHp() {
        if (isPaused) return;

        var kamiContainers = partyDiv.querySelectorAll("img[src$='.gif']");
        kamiContainers.forEach(function(img) {
            var kamiDiv = img.closest("div");
            if (!kamiDiv) return;

            var infoContainer = kamiDiv.querySelector("div > div");
            if (infoContainer) {
                var nameElement = infoContainer.querySelector("div > div");
                var kamiName = nameElement ? getCleanKamiName(nameElement) : "Unknown Kami";

                var healthSpan = infoContainer.querySelector('span[aria-label*="Health"]');
                if (healthSpan) {
                    var healthText = healthSpan.getAttribute("aria-label");
                    var hpMatch = healthText.match(/Health:\s*(\d+)\/(\d+)/);
                    if (hpMatch) {
                        var currentHp = parseInt(hpMatch[1]);
                        var maxHp = parseInt(hpMatch[2]);
                        kamiDiv.maxHp = maxHp;

                        updateKamiHP(kamiName, currentHp);

                        var missingHp = maxHp - currentHp;
                        logToConsole(`HP found for ${kamiName}: ${currentHp}/${maxHp} (-${missingHp})`);

                        var missingHpSpan = infoContainer.querySelector(".missing-hp-indicator");
                        if (!missingHpSpan) {
                            missingHpSpan = document.createElement("span");
                            missingHpSpan.className = "missing-hp-indicator";
                            missingHpSpan.style.cssText = "color: red; font-weight: bold; margin-left: 10px;";
                            healthSpan.parentNode.appendChild(missingHpSpan);
                        }
                        missingHpSpan.textContent = `-${missingHp}`;

                        if (missingHp >= 25) {
                            logToConsole(`Kami ${kamiName} is missing more than 25 HP (missing ${missingHp})`);
                            feedKami(kamiDiv, kamiName, currentHp);
                        }
                    }
                }
            } else {
                logToConsole("Info container not found for this kami.");
            }
        });

        console.log("Current Kami HP History:", kamiHPData);

        checkDesynchronization();
        logToConsole("Scanning for kami HP again in 180 seconds");
        startCountdown(180);
    }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            countdownSpan.textContent = "(Bot is paused)";
            countdownSpan.style.color = "orange";
            pauseButton.textContent = "Resume Bot";
        } else {
            countdownSpan.style.color = "black";
            pauseButton.textContent = "Pause Bot";
            startCountdown(180);
        }
    }

    function terminateBot() {
        clearInterval(scanInterval);
        clearInterval(countdownInterval);
        
        countdownSpan.remove();
        evacuationReasonSpan.remove();
        buttonContainer.remove();
        botTitleDiv.remove();

        document.querySelectorAll(".missing-hp-indicator").forEach(indicator => indicator.remove());
        
        logToConsole("KamiBot terminated.");
    }

    function evacuateAllKamis(reason) {
        var nodeDiv = document.getElementById("node");
        if (!nodeDiv) {
            logToConsole("Node div not found.");
            return;
        }

        var stopHarvestSpans = nodeDiv.querySelectorAll('span[aria-label="Stop Harvest"]');
        if (stopHarvestSpans.length === 0) {
            logToConsole("No kamis currently harvesting.");
            return;
        }

        stopHarvestSpans.forEach(span => {
            var stopButton = span.querySelector("button");
            if (stopButton) {
                stopButton.click();
                logToConsole(`Stopped kami from harvesting. Reason: ${reason}`);
            } else {
                logToConsole("Stop button not found within Stop Harvest span.");
            }
        });

        showEvacuationReason(reason);
    }

    pauseButton.addEventListener("click", togglePause);
    terminateButton.addEventListener("click", terminateBot);
    evacuateButton.addEventListener("click", () => evacuateAllKamis("Manual evacuation"));

    checkHp();
    scanInterval = setInterval(checkHp, 180000);
})();