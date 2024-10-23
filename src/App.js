import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [money, setMoney] = useState(() => Number(localStorage.getItem("money")) || 0);
    const [moneyPerClick, setMoneyPerClick] = useState(() => Number(localStorage.getItem("moneyPerClick")) || 1);
    const [autoEarnings, setAutoEarnings] = useState(() => Number(localStorage.getItem("autoEarnings")) || 0);
    const [prestigePoints, setPrestigePoints] = useState(() => Number(localStorage.getItem("prestigePoints")) || 0);
    const [prestigeCount, setPrestigeCount] = useState(() => Number(localStorage.getItem("rebirthCount")) || 0); // renamed to prestigeCount
    const [prestigeMultiplier, setPrestigeMultiplier] = useState(() => Number(localStorage.getItem("prestigeMultiplier")) || 1);
    const [prestigeCost, setPrestigeCost] = useState(() => Number(localStorage.getItem("prestigeCost")) || 1000);
    const [upgradePage, setUpgradePage] = useState(false);
    const [casinoOpen, setCasinoOpen] = useState(false);
    const [casinoOutcome, setCasinoOutcome] = useState("");
    const [betColor, setBetColor] = useState("");
    const [wheelSpin, setWheelSpin] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // popup for win/loss
    const [luckOpen, setLuckOpen] = useState(false); // For "Test Your Luck" feature
    const [prize, setPrize] = useState(null); // Track the prize
    const [playTime, setPlayTime] = useState(0); // Track playtime

    // Prize pool for "Test Your Luck"
    const prizePool = [
        { name: 'Small Prize', value: 100, chance: 0.6 },
        { name: 'Medium Prize', value: 500, chance: 0.3 },
        { name: 'Big Prize', value: 1000, chance: 0.09 },
        { name: 'Jackpot', value: 10000, chance: 0.01 },
    ];

    // Save game data in localStorage on changes
    useEffect(() => {
        localStorage.setItem("money", money);
        localStorage.setItem("moneyPerClick", moneyPerClick);
        localStorage.setItem("autoEarnings", autoEarnings);
        localStorage.setItem("prestigePoints", prestigePoints);
        localStorage.setItem("rebirthCount", prestigeCount);
        localStorage.setItem("prestigeMultiplier", prestigeMultiplier);
        localStorage.setItem("prestigeCost", prestigeCost);
    }, [money, moneyPerClick, autoEarnings, prestigePoints, prestigeCount, prestigeMultiplier, prestigeCost]);

    // Increment playtime every second
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let lastPressTime = 0;
        let pressCount = 0;

        const handleKeyDown = (event) => {
            if (event.key === '.') {
                const currentTime = Date.now();
                if (currentTime - lastPressTime <= 3000) {
                    pressCount++;
                } else {
                    pressCount = 1; // reset count if more than 3 seconds
                }

                lastPressTime = currentTime;

                if (pressCount === 3) {
                    setShowKeyInput(true);
                    pressCount = 0; // reset count after opening input
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Function to check private key
    const checkPrivateKey = () => {
        const privateKey = `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD1zHX4hKpRC9V9RlbvhYBLvp/3qmy9yTq3+JucvliM8nnS8QuGrMnA5l/SQraZ3YFBAilJeZEQHObXxLmWWbN0Ttf96vc1OeFsMoqmOTBX12BjxfF5ikeR9wTB0XI2dd0Ks4rGMOqpzHnG2ZyoUOtsXPhgRhZjggqeuI6N6PlhFRLsSch84m5hFB926yWJT/nVPr8pP8sCB7SGt2KPlstYpLtJnyuIG0xCkaCOXheEnigJgfO9Ggbk7GEy4f4AkuZFtr0ALv81IdXQpfcPfFQ4xDgj1jgbao6UId0C9PaEiiJAghPqcH9Igx6XX+evSEe1tdOa7dE8OBCEa74a7JkJAgMBAAECggEADxby6cOAjo0tbrgSFOObPAst2DnW3H0tZPyW1l6RInCtrezXtPgyl+xiAY8llU3rO3RzLcGQIu8Yn4fCOkqzdkvI0sZz+rPc9Ol9aDWmlB3yxZfx+nDUx/nkNDSJex0X6X+a4LlBZBSGKAEABGKYsVmxHdKaWULd0rSoe78hCtFDlVuvnEUfEXcQtwAIElgh6DL5nHYUsD8HTFZMCakZyyS7wzeL4fi+W0Be1xUZgxHDTR68bQBa2hdLLg4hbAgOEmcWIT9jgygAYf+d4yCVQENjkwgYxMF7GmVKWCM42bzP+3cf4HdYZu2gWn1K4jwy+OYKVUaOrIXRdFSP+oLnoQKBgQD72opPccsAlUZzaNHYFTKzs5UhJ+TrZVxevzkqw5AuHTc+UCVNBORNKjXt1DNr7O4Y5XltP58PMKdasgMqtZcpEZ60/LunUBJjHj329oyCHOEHwSgmmChioJ8M/aoLUdxIBKtBBhQ4f2u0SXx/Q1avoFVT+JDirjfcZK8+sKlw9QKBgQD52Ga2bT7WBnXwDIY1lw4HisOBR+rw2xYBiFtIeG4RJfjyhXYGHs+kchIuCEOo6MwIQUzZZN60W0PMmaUKjgn8QHLxuN2j1Tn7Po8z+KA33HjwbtUxD5C9tiXTMjMkvgFZ8LqoKNUH/NdStjg+ag0BQXiOhkRqsH+swTmoPSgrRQKBgB22puLAlia3ddxf3YIU3ip9YXbL8iIjj0ZOYTw+XmBSahYb9oqjrRu9gydQBdER3vVo/W56NxXfs57rqZv8WJ0rywGnX6xZshGnm7/rTqB7L8FudII5KWqZcKpjsxAq1EZa5qmBQhl4TwiyMtIA69VEoUyK4u0biNOjvVk0FomRAoGAPlG/FQPc54/G/TByjY13H2R6bZXdwWQ0cf9sHYCEm9xn4z5s+QvYaUFWzYqcLdabhfebzqH9dulI2RD9DbXjLZQ7iwgMFUeXHb2GbPTeTKV4HWSRffwLhf5isXU82Pgrg6HRLvVh9lvViF1BlRB8nkp3HynWXc8FwsakzqAEXL80tEMgB6cxonak=`;

        if (keyInput === privateKey) {
            setDevMode(true);
            setShowKeyInput(false);
            setKeyInput("");
        } else {
            alert("Invalid key. Please try again.");
        }
    };
    // 1-hour reminder
    useEffect(() => {
        if (playTime >= 3600) {
            setShowPopup(true);
        }
    }, [playTime]);

    // Click handler to earn money
    const handleClick = () => {
        setMoney(prev => prev + (moneyPerClick * prestigeMultiplier));
    };

    // Purchase upgrade, double its price after purchase
    const buyUpgrade = (cost, increase, upgradeName) => {
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setMoneyPerClick(prev => prev + increase);
            return cost * 2; // Return new cost (doubled)
        }
        return cost;
    };

    // Purchase auto-earning upgrade
    const buyAutoEarnings = (cost, increase) => {
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setAutoEarnings(prev => prev + increase);
            return cost * 2; // Return new cost (doubled)
        }
        return cost;
    };

    // Casino function: Open a menu with two buttons for red or blue
    const openCasino = () => {
        setCasinoOpen(true);
        setCasinoOutcome("");
        setBetColor("");
        setWheelSpin(false);
    };

    // Spin the wheel and determine the outcome
    const spinWheel = (color) => {
        if (money > 0) {
            setBetColor(color);
            setWheelSpin(true); // Start spinning animation

            const outcome = Math.random() < 0.5 ? "red" : "blue";
            setTimeout(() => {
                if (outcome === color) {
                    setMoney(prev => prev * 2); // Double the money
                    setCasinoOutcome(`The wheel landed on ${outcome}! You won and doubled your money!`);
                } else {
                    setMoney(0); // Lose all money
                    setCasinoOutcome(`The wheel landed on ${outcome}. You lost all your money.`);
                }
                setShowPopup(true); // Show win/loss popup
                setCasinoOpen(false); // Close the casino after result
                setWheelSpin(false); // Stop spinning
            }, 3000); // Simulate spin delay
        }
    };

    // Prestige system with scaling cost
    const prestige = () => {
        if (money >= prestigeCost) {
            setPrestigePoints(prev => prev + 1);
            setPrestigeMultiplier(prev => prev + 0.5);
            setMoney(0);
            setMoneyPerClick(1);
            setAutoEarnings(0);
            setPrestigeCount(prev => prev + 1); // Increment prestige count
            setPrestigeCost(prev => prev * 2); // Double prestige cost
        }
    };

    // Auto earnings with a visual click effect
    useEffect(() => {
        const interval = setInterval(() => {
            setMoney(prev => prev + autoEarnings * prestigeMultiplier);
        }, 1000);

        return () => clearInterval(interval);
    }, [autoEarnings, prestigeMultiplier]);

    // Test your luck feature
    const testYourLuck = () => {
        if (money > 0) {
            setLuckOpen(true);
            setMoney(0); // Lose all your money in exchange for luck spin

            const rand = Math.random();
            let selectedPrize = null;

            for (let prize of prizePool) {
                if (rand <= prize.chance) {
                    selectedPrize = prize;
                    break;
                }
            }

            setPrize(selectedPrize ? selectedPrize : { name: 'Nothing', value: 0 });
        }
    };

    // Double or nothing feature
    const doubleOrNothing = () => {
        const rand = Math.random();
        if (rand < 0.05) { // 5% chance to win double
            setMoney(prev => prev + prize.value * 2); // Win double
            setCasinoOutcome(`You won double! Prize value: $${prize.value * 2}`);
        } else {
            setCasinoOutcome(`You lost it all!`);
            setMoney(0); // Lose everything
        }
        setLuckOpen(false); // Close luck mode
        setShowPopup(true); // Show popup for result
    };

    return (
        <div className="App">
            <h1 className="title">Moula Moula [BETA]</h1>
            <h2 className="money">Money: ${money.toFixed(2)}</h2>
            <h3>Money Per Click: ${moneyPerClick * prestigeMultiplier}</h3>
            <h3>Auto Earnings: ${autoEarnings * prestigeMultiplier}/sec</h3>
            <h3>Prestige Points: {prestigePoints}</h3>
            <h3>Prestige Multiplier: x{prestigeMultiplier}</h3>
            <h3>Prestige Count: {prestigeCount}</h3>
            <h3>Prestige Cost: ${prestigeCost}</h3>

            <div className="button-container">
                {!upgradePage && !casinoOpen && !luckOpen ? (
                    <>
                        <button onClick={handleClick} className="main-button">Click to Earn Money</button>
                        <button onClick={() => buyUpgrade(50, 2, 'Basic Upgrade')} disabled={money < 50} className="upgrade-button">Buy Upgrade (+$2 per click) (Cost: $50)</button>
                        <button onClick={() => buyAutoEarnings(100, 1)} disabled={money < 100} className="upgrade-button">Buy Auto-Earnings (+$1/sec) (Cost: $100)</button>
                        <button onClick={openCasino} className="casino-button">Open Blind Betting (Casino)</button>
                        <button onClick={testYourLuck} className="luck-button">Test Your Luck</button> {/* Added Test Your Luck */}
                        <button onClick={prestige} disabled={money < prestigeCost} className="prestige-button">Prestige (Cost: ${prestigeCost})</button>
                        <button onClick={() => setUpgradePage(true)} className="upgrade-page-button">Go to Upgrades Page</button>
                        {casinoOutcome && <p className="casino-outcome">{casinoOutcome}</p>}
                    </>
                ) : upgradePage ? (
                    <>
                        <button onClick={() => setUpgradePage(false)} className="back-button">Back to Main Game</button>
                        <h2>Upgrades</h2>
                        <button onClick={() => buyUpgrade(100, 5, 'New House')} disabled={money < 100} className="upgrade-button">Buy New House (Cost: $100)</button>
                        <button onClick={() => buyUpgrade(200, 10, 'Machine')} disabled={money < 200} className="upgrade-button">Buy Machine (Cost: $200)</button>
                        <button onClick={() => buyUpgrade(500, 20, 'Food Production')} disabled={money < 500} className="upgrade-button">Buy Food Production (Cost: $500)</button>
                    </>
                ) : casinoOpen ? (
                    <>
                        <h2>Blind Betting - Choose Your Color</h2>
                        <div className="wheel">
                            <div className={`spinner ${wheelSpin ? 'spinning' : ''}`}></div>
                        </div>
                        <button onClick={() => spinWheel('red')} className="casino-button">Bet on Red</button>
                        <button onClick={() => spinWheel('blue')} className="casino-button">Bet on Blue</button>
                        <button onClick={() => setCasinoOpen(false)} className="back-button">Back to Main Game</button>
                    </>
                ) : luckOpen ? (
                    <>
                        <h2>You won: {prize?.name || 'Nothing'} worth ${prize?.value || 0}!</h2>
                        <button onClick={() => setMoney(prize?.value)} className="casino-button">Cash Out</button>
                        <button onClick={doubleOrNothing} className="casino-button">Double or Nothing</button>
                    </>
                ) : null}
            </div>

            {showPopup && (
                <div className="popup">
                    <h2>{casinoOutcome || 'Hello, Just Making Sure You are There!'}</h2>
                    <button onClick={() => setShowPopup(false)}>OK</button>
                </div>
            )}

                        {showKeyInput && (
                <div className="popup">
                    <h2>Enter Secret Key</h2>
                    <input 
                        type="text" 
                        value={keyInput} 
                        onChange={(e) => setKeyInput(e.target.value)} 
                    />
                    <button onClick={checkPrivateKey}>Submit</button>
                    <button onClick={() => setShowKeyInput(false)}>Cancel</button>
                </div>
            )}

            {/* Development Menu */}
            {devMode && (
                <div className="dev-menu">
                    <h2>Development Menu</h2>
                    <button onClick={() => setMoney(money + 10000)}>Add 10,000 Money</button>
                    <button onClick={() => setMoneyPerClick(moneyPerClick + 1)}>Increase Money per Click</button>
                    <button onClick={() => setAutoEarnings(autoEarnings + 1)}>Increase Auto Earnings</button>
                    <button onClick={() => setPrestigePoints(prestigePoints + 1)}>Add Prestige Point</button>
                    <button onClick={() => setPrestigeCost(prestigeCost * 2)}>Double Prestige Cost</button>
                    <button onClick={() => setCasinoOpen(true)}>Open Casino</button>
                    {/* Add other dev features here */}
                </div>
            )}
      

            <footer className="footer">Game by: @xlnk - This game is in current development and in a BETA stage. Contact @xlnk on Discord for any bug fixes or ideas to add!</footer>
        </div>
    );
};

export default App;
