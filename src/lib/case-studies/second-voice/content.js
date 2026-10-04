const ORIGINAL = 'The street was empty when she arrived. She waited by the door and checked her phone again.';
const VOICES = [
  {id:'spare', name:'Spare', desc:'Fewer words, harder edges.'},
  {id:'lyrical', name:'Lyrical', desc:'Longer rhythm, more image.'},
  {id:'noir', name:'Noir', desc:'Clipped, wry and shadowed.'}
];
const STRENGTHS = [{id:'light', name:'Light'}, {id:'strong', name:'Strong'}];
const REWRITES = {
  spare:{light:'The street was empty when she got there. She waited by the door and checked her phone.', strong:'Empty street. She waited at the door. Checked her phone.'},
  lyrical:{light:'The street lay empty when she arrived. She lingered by the door and checked her phone once more.', strong:'The street had emptied itself by the time she arrived. She lingered at the door, the phone glowing in her palm, as if it might change its mind.'},
  noir:{light:'The street was dead when she arrived. She waited by the door and checked her phone again.', strong:'Nobody on the street when she showed up. She leaned on the door and checked her phone again, like it owed her money.'}
};
const vName = id => VOICES.find(v => v.id === id).name;
const sName = id => STRENGTHS.find(s => s.id === id).name.toLowerCase();
const label = st => `${vName(st.voice)}, ${sName(st.strength)}`;
const same = (a, b) => a.voice === b.voice && a.strength === b.strength;


export {ORIGINAL,VOICES,STRENGTHS,REWRITES,vName,sName,label,same};
