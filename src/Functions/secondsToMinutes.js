export const secondsToMinutes=(seconds)=>{
    const min = Math.floor(seconds/60) 
    const sec=seconds%60
    return min+":"+sec.toFixed(0)
}

export const seekBarStyle = {
    width: '90%',
    height: '8px',
    position: 'relative'
    // Ensuring relative positioning
  };
