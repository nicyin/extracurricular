// Text prompts array
const textPrompts = [
    "Think of a friend in another continent. Estimate the time zone difference.",
    "Text someone in a later time zone a small update from \"the future\".",
    "Send someone in another time zone their local weather report before they wake up.",
    "Text someone a forecast of their day before they're awake in another time zone.",
    "Describe a dream for someone who is about to go to sleep in another time zone.",
    "Send someone in another time zone a photo of a clock showing their current time.",
    "Choose a friend in another time zone. Choose a time. Send each other a photo of what you were doing at that exact time today.",
    "Ask a friend in another time zone what they had for breakfast / lunch / or dinner. Eat the same thing for your breakfast / lunch / or dinner.",
    "Send someone in another time zone your favorite headline from your morning news.",
    "Call someone in another time zone. Describe to them a funny meme or video you saw today instead of sending it on IG.",
    "Think of a friend in another time zone. Plan their outfit for them before they wake up.",
    "Ask your friend in another time zone for their OOTD. Try to recreate that outfit today/tomorrow.",
    "Think of a friend in another time zone. Calculate how many hours of time difference there are between you. Do that number of jumping jacks.",
    "Check on a friend in another time zone. If they're sleeping, you can doomscroll for another 15 minutes.",
    "Check on a friend in another time zone. If they're awake, close half of your browser tabs (phone or laptop).",
    "Write a message for a friend in another time zone. Check the current time. Send it to them when it's the same time in their time zone.",
    "Draw a tarot card for a friend living in a different time zone. Are you sharing their past or foreseeing their future?",
    "Instead of breakfast, eat dinner; and vice versa, depending on your time of day.",
    "Draw a circle. Don't complete it until the sun has risen in your friend's time zone.",
    "Think of a friend in a different time zone. Learn how to say 'hello' in the language of another country in their time zone."
];

// Display random text prompt
function displayRandomText() {
    const randomIndex = Math.floor(Math.random() * textPrompts.length);
    document.getElementById('randomText').textContent = textPrompts[randomIndex];
}

// Update clocks
function updateClocks() {
    const now = new Date();
    
    // Berlin time
    const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    const berlinHours = berlinTime.getHours();
    const berlinMinutes = berlinTime.getMinutes();
    const berlinSeconds = berlinTime.getSeconds();
    
    // Taipei time
    const taipeiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    const taipeiHours = taipeiTime.getHours();
    const taipeiMinutes = taipeiTime.getMinutes();
    const taipeiSeconds = taipeiTime.getSeconds();
    
    // Calculate angles
    const berlinHourAngle = ((berlinHours % 12) + berlinMinutes / 60) * 30;
    const berlinMinuteAngle = (berlinMinutes + berlinSeconds / 60) * 6;
    
    const taipeiHourAngle = ((taipeiHours % 12) + taipeiMinutes / 60) * 30;
    const taipeiMinuteAngle = (taipeiMinutes + taipeiSeconds / 60) * 6;
    
    // Update Berlin clock
    document.getElementById('berlinHour').setAttribute('transform', `rotate(${berlinHourAngle})`);
    document.getElementById('berlinMinute').setAttribute('transform', `rotate(${berlinMinuteAngle})`);
    
    // Update Taipei clock
    document.getElementById('taipeiHour').setAttribute('transform', `rotate(${taipeiHourAngle})`);
    document.getElementById('taipeiMinute').setAttribute('transform', `rotate(${taipeiMinuteAngle})`);
}

// Fetch and display are.na blocks
async function fetchArenaBlocks() {
    const container = document.getElementById('arenaContainer');
    const channelSlug = 'extracurricular-eavr_p_fmuw';
    
    try {
        const response = await fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`);
        const data = await response.json();
        
        if (!data.contents) {
            console.error('No contents found');
            return;
        }
        
        // Reverse chronological order (newest first)
        const blocks = [...data.contents].reverse();
        
        // Calculate undulating pattern and positioning
        let currentX = 0;
        const baseY = window.innerHeight * 0.1; // Start at 10% from top (within 55vh)
        const waveAmplitude = window.innerHeight * 0.15; // Wave height (keeps within 55vh)
        const waveFrequency = 0.3; // How often the wave repeats
        
        blocks.forEach((block, index) => {
            const blockElement = createBlockElement(block, index);
            
            // Calculate undulating vertical position
            const verticalOffset = Math.sin(index * waveFrequency) * waveAmplitude;
            const yPosition = baseY + verticalOffset;
            
            // Position the block
            blockElement.style.left = `${currentX}px`;
            blockElement.style.top = `${yPosition}px`;
            
            // Z-index decreases from left to right (highest on left)
            const baseZIndex = 100 - index;
            blockElement.style.zIndex = baseZIndex;
            blockElement.dataset.baseZIndex = baseZIndex;
            
            container.appendChild(blockElement);
            
            // Update horizontal position for next block
            // Use fixed width for consistent spacing
            const blockWidth = 320; // Match the fixed CSS width
            currentX += blockWidth * 0.8; // 80% overlap for stacking effect
        });
        
        // Set container width to accommodate all blocks
        container.style.width = `${currentX + 500}px`;
        
        // Add hover listeners
        addHoverListeners();
        
    } catch (error) {
        console.error('Error fetching are.na blocks:', error);
        container.innerHTML = '<div class="loading">Error loading content</div>';
    }
}

// Create block element based on type
function createBlockElement(block, index) {
    const div = document.createElement('div');
    div.className = 'arena-block';
    
    if (block.class === 'Image' && block.image) {
        const img = document.createElement('img');
        img.src = block.image.large?.url || block.image.original?.url || block.image.display?.url;
        img.alt = block.title || 'Are.na image';
        div.appendChild(img);
    } else if (block.class === 'Text' && block.content_html) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text-content';
        textDiv.innerHTML = block.content_html;
        div.appendChild(textDiv);
    } else if (block.class === 'Attachment' && block.attachment) {
        const pdfDiv = document.createElement('div');
        pdfDiv.className = 'pdf-content';
        const link = document.createElement('a');
        link.href = block.attachment.url;
        link.target = '_blank';
        link.textContent = block.title || 'View PDF';
        pdfDiv.appendChild(link);
        div.appendChild(pdfDiv);
    } else if (block.class === 'Link' && block.image) {
        const img = document.createElement('img');
        img.src = block.image.large?.url || block.image.original?.url || block.image.display?.url;
        img.alt = block.title || 'Are.na link';
        img.onclick = () => window.open(block.source?.url || block.attachment?.url, '_blank');
        div.appendChild(img);
    }
    
    return div;
}

// Add hover listeners to bring blocks to top
function addHoverListeners() {
    const blocks = document.querySelectorAll('.arena-block');
    blocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.zIndex = '999';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.zIndex = this.dataset.baseZIndex;
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayRandomText();
    updateClocks();
    setInterval(updateClocks, 1000); // Update clocks every second
    fetchArenaBlocks();
});
