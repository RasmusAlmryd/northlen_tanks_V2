import { useEffect, useRef } from "react";
// import tankPreviewImg form "../..public/tankPreview.png";


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

export default function({mainColor, size}){

    size = size ? size : 70 


    const canvas = useRef();
    const lightColor = '#b3202a';
    const darkColor = '#73172d';
    const shadowValue = 30;


    useEffect(() =>{
        const context = canvas.current.getContext("2d");
        context.imageSmoothingEnabled = false;
        const image = new Image();
        
        image.src = process.env.PUBLIC_URL + "/tankPreview.png"
        image.onload = () =>{
            context.drawImage(image, 0, 0, size, size);
            const imgData = context.getImageData(0, 0, size, size);
            const data = imgData.data;
            
            const lightColorRGB = hexToRgb(lightColor);
            const darkColorRGB = hexToRgb(darkColor);
            const mainColorRGB = hexToRgb(mainColor);

            for(let i = 0; i < data.length; i += 4){
                
                if(data[i] == lightColorRGB.r && data[i+1] == lightColorRGB.g && data[i+2] == lightColorRGB.b){
                    data[i] = mainColorRGB.r;
                    data[i+1] = mainColorRGB.g
                    data[i+2] = mainColorRGB.b
                    continue;
                }

                if(data[i] == darkColorRGB.r && data[i+1] == darkColorRGB.g && data[i+2] == darkColorRGB.b){
                    data[i] = mainColorRGB.r - shadowValue;
                    data[i+1] = mainColorRGB.g - shadowValue;
                    data[i+2] = mainColorRGB.b - shadowValue;
                }
            } 

            context.putImageData(imgData, 0,0)
        }
        
    }, [])

    return(
        <canvas ref={canvas} width={size} height={size}/>
    )

    

}

