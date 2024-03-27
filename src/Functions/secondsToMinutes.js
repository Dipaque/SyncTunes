export const secondsToMinutes=(seconds)=>{
    const min = Math.floor(seconds/60) 
    const sec=seconds%60
    if(sec<=9){
        return min+":"+'0'+sec.toFixed(0)
    }else{
        return min+":"+sec.toFixed(0)
    }
}

export const seekBarStyle = {
    width: '90%',
    height: '8px',
    position: 'relative'
    // Ensuring relative positioning
  };
