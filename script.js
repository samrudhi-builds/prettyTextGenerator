// Categorized style definitions and transformation helpers
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';

// Helper: safe array from string (handles surrogate pairs)
const charsToArray = (s) => Array.from(s || '');

// Combining marks for Zalgo
const zalgoUp = ['\u030d','\u030e','\u0304','\u0305','\u033f','\u0311','\u0306','\u0310','\u0352','\u0357','\u0351','\u0307','\u0308','\u030a','\u0312','\u0313','\u0314','\u033d','\u0309','\u0363'];
const zalgoDown = ['\u0316','\u0317','\u0318','\u0319','\u031c','\u031d','\u031e','\u031f','\u0320','\u0324','\u0325','\u0326','\u0329','\u032a','\u032b','\u032c','\u032d','\u032e','\u032f','\u0330'];
const zalgoMid = ['\u0334','\u0335','\u0336','\u034f','\u035c','\u035d','\u035e','\u035f','\u0360','\u0362','\u0338','\u0337'];

function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// Transform helpers
function fullwidthTransform(text){
    // Map ASCII 33-126 -> fullwidth by adding 0xFEE0; space -> U+3000
    let out = '';
    for (let ch of text){
        const code = ch.charCodeAt(0);
        if (code === 32) { out += '\u3000'; }
        else if (code >= 33 && code <= 126) { out += String.fromCharCode(code + 0xFEE0); }
        else out += ch;
    }
    return out;
}

function leetTransform(text){
    const map = {a:'4',A:'4',e:'3',E:'3',l:'1',L:'1',o:'0',O:'0',s:'5',S:'5',t:'7',T:'7',i:'1',I:'1',g:'6',G:'6'};
    return Array.from(text).map(ch => map[ch] || ch).join('');
}

function zalgoTransformFactory(min, max){
    return function(text){
        let out = '';
        for (let ch of text){
            out += ch;
            if (ch === ' ') continue;
            const count = Math.floor(Math.random()*(max-min+1))+min;
            for (let i=0;i<count;i++){
                const pool = Math.random()<0.33 ? zalgoUp : (Math.random()<0.5 ? zalgoMid : zalgoDown);
                out += randomChoice(pool);
            }
        }
        return out;
    }
}

function combiningTransformFactory(combiningChar){
    return function(text){
        let out = '';
        for (let ch of text){
            if (ch === ' ') out += ch;
            else out += ch + combiningChar;
        }
        return out;
    }
}

function wideSpaced(text){ return Array.from(text).join(' '); }

function upsideDownTransform(text){
    const map = {
        'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ɓ','h':'ɥ','i':'ᴉ','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z',
        'A':'∀','B':'ᗺ','C':'Ɔ','D':'◖','E':'Ǝ','F':'Ⅎ','G':'פ','H':'H','I':'I','J':'ſ','K':'⋊','L':'˥','M':'W','N':'N','O':'O','P':'Ԁ','Q':'Q','R':'ᴚ','S':'S','T':'⊥','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z',
        '.':'˙',',':'\'',"'":',','"':'„','?':'¿','!':'¡','`':',','(':')',')':'(','[':']',']':'[','{':'}','}':'{','<':'>','>':'<','_':'‾','&':'⅋'
    };
    return Array.from(text).map(ch => map[ch] || map[ch.toLowerCase()] || ch).reverse().join('');
}

// Circled letters and digits
function circledTransform(text){
    let out = '';
    for (let ch of text){
        const code = ch.charCodeAt(0);
        if (ch >= 'A' && ch <= 'Z'){
            out += String.fromCodePoint(0x24B6 + (code - 65));
        } else if (ch >= 'a' && ch <= 'z'){
            out += String.fromCodePoint(0x24D0 + (ch.charCodeAt(0) - 97));
        } else if (ch >= '1' && ch <= '9'){
            out += String.fromCodePoint(0x2460 + (ch.charCodeAt(0) - 49));
        } else if (ch === '0'){
            out += String.fromCodePoint(0x24EA);
        } else out += ch;
    }
    return out;
}

// Small caps approximation for lowercase letters
const smallCapsMap = {
    'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'
};
function smallCapsTransform(text){ return Array.from(text).map(ch => (ch>='a'&&ch<='z')? smallCapsMap[ch] : ch).join(''); }

// Superscript approximation (partial)
const superscriptMap = {'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'ᵠ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ'};
function superscriptTransform(text){ return Array.from(text).map(ch => superscriptMap[ch.toLowerCase()] || ch).join(''); }

// The style categories object
const styleCategories = {
    'Classic': {
        'Bold': { chars: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃' },
        'Italic': { chars: '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧' },
        'Bold Italic': { chars: '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛' },
        'Script': { chars: '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏' },
        'Bold Script': { chars: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃' },
        'Fraktur': { chars: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷' },
        'Bold Fraktur': { chars: '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟' },
        'Double-Struck': { chars: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫' },
        'Sans-Serif': { chars: '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓' },
        'Sans-Serif Bold': { chars: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇' },
        'Sans-Serif Italic': { chars: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻' },
        'Monospace': { chars: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣' }
    },
    'Nerd': {
        'Leetspeak': { transform: leetTransform },
        'Vaporwave (Fullwidth)': { transform: fullwidthTransform },
        'Zalgo Light': { transform: zalgoTransformFactory(1,3) },
        'Zalgo Heavy': { transform: zalgoTransformFactory(4,8) }
    },
    'Enclosed': {
        'Circled': { transform: circledTransform }
    },
    'Text Effects': {
        'Strikethrough': { transform: combiningTransformFactory('\u0336') },
        'Underline': { transform: combiningTransformFactory('\u0332') },
        'Slash Through': { transform: combiningTransformFactory('\u0338') },
        'Double Underline': { transform: combiningTransformFactory('\u0333') }
    },
    'Aesthetic': {
        'Small Caps': { transform: smallCapsTransform },
        'Superscript': { transform: superscriptTransform },
        'Upside Down': { transform: upsideDownTransform },
        'Wide Spaced': { transform: wideSpaced }
    }
};

// Core conversion: supports three modes per style: transform (function), combining (via transform factory), or chars mapping
function convertText(text, style){
    if (!text) return '';
    // Priority: transform function
    if (style.transform && typeof style.transform === 'function'){
        return style.transform(text);
    }

    // If explicit chars mapping provided (A-Za-z mapping)
    if (style.chars){
        const styleArray = charsToArray(style.chars);
        let result = '';
        for (let ch of text){
            const idx = alphabet.indexOf(ch);
            if (idx !== -1 && styleArray[idx]) result += styleArray[idx];
            else result += ch;
        }
        return result;
    }

    // Fallback: return original
    return text;
}

// Copy to clipboard (keeps existing UI behavior)
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = '✓ Copied!';
        element.classList.add('copied');
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('copied');
        }, 1500);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const originalText = element.textContent;
        element.textContent = '✓ Copied!';
        element.classList.add('copied');
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('copied');
        }, 1500);
    });
}

// Render categorized output
function updateOutput() {
    const inputText = document.getElementById('input-text').value;
    const outputContainer = document.getElementById('output-container');

    if (!inputText.trim()) {
        outputContainer.innerHTML = '<div class="placeholder-text">Your fancy text will appear here...</div>';
        return;
    }

    outputContainer.innerHTML = '';

    for (let [categoryName, styles] of Object.entries(styleCategories)){
        const section = document.createElement('div');
        section.className = 'category-section';

        const header = document.createElement('h3');
        header.className = 'category-header';
        header.textContent = categoryName;
        section.appendChild(header);

        for (let [styleName, styleData] of Object.entries(styles)){
            const convertedText = convertText(inputText, styleData);

            const outputItem = document.createElement('div');
            outputItem.className = 'output-item';

            const label = document.createElement('div');
            label.className = 'style-label';
            label.textContent = styleName;

            const textDiv = document.createElement('div');
            textDiv.className = 'style-text';
            textDiv.textContent = convertedText;

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => copyToClipboard(convertedText, copyBtn);

            outputItem.appendChild(label);
            outputItem.appendChild(textDiv);
            outputItem.appendChild(copyBtn);
            section.appendChild(outputItem);
        }

        outputContainer.appendChild(section);
    }
}

// Event listener for input
document.getElementById('input-text').addEventListener('input', updateOutput);

// Initialize
updateOutput();
