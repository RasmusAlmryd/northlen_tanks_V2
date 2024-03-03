

export default class ColorLoader {

    static async getSpriteSheets(scene,url,prefix, colors, sizeInfo, basePrimaryColor='#b3202a', baseSecondaryColor='#73172d', baseThirdColor='#422433'){

        let mainPromise = new Promise((res, rej) => {
            let img = new Image();
            img.crossOrigin = "anonymous";
    
            
            img.onload = async () => {
                let canvas = document.createElement('canvas');
                let editCanvas = document.createElement('canvas');

                canvas.width = img.width;
                canvas.height = img.height;
                editCanvas.width = img.width;
                editCanvas.height = img.height;


                canvas.style.position = 'fixed';
                editCanvas.style.position = 'fixed';

                canvas.style.top = '110hv';
                editCanvas.style.top = '110hv'
    
    
                document.body.appendChild(canvas);
                document.body.appendChild(editCanvas);
    
                let ctx = canvas.getContext('2d');
                let editCtx = editCanvas.getContext('2d');
    
                ctx.drawImage(img, 0, 0);
                let imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    
                const basePrimary = hexToRgb(basePrimaryColor);
                const baseSecondary = hexToRgb(baseSecondaryColor);
                const baseThird = hexToRgb(baseThirdColor)  
    
                for(const color of colors){
                    console.log(color);
                    let promise = new Promise((resolve, reject) => {
                        

                        let outData = this.editPixels(imgData.data, hexToRgb(color), basePrimary, baseSecondary, baseThird);

                        let editImageData = new ImageData(outData, imgData.width, imgData.height);
                        // editImageData.data.set(outData);

                        editCtx.putImageData(editImageData, 0, 0);
                        let newImg = new Image();
    
                        newImg.onload = () => {
                            scene.textures.addSpriteSheet(prefix+'-'+color, newImg, sizeInfo);
                            resolve();
                        }
    
                        newImg.src = editCanvas.toDataURL();
                    })
    
                    await promise;  
                    // console.log('color: ', color, ' loaded');
                };
                
    
                // console.log('draw');
                canvas.remove();
                editCanvas.remove();
                res();
            }
    
            img.src = url;
        })

        await mainPromise;
        

    }

    static editPixels(imgData, color, basePrimaryColor, baseSecondaryColor, baseThirdColor){
        const colorHSV = this.rgbToHsv(color.r, color.g, color.b); 
        const color2 = this.hsvToRgb(colorHSV.h, colorHSV.s, colorHSV.v-0.2);
        const shadowColor = this.hsvToRgb(colorHSV.h, colorHSV.s, colorHSV.v-0.5);

        let outData = new Uint8ClampedArray(imgData.length);

        console.log('HSV: ', colorHSV);
        for(let i = 0; i < imgData.length; i+=4){
            outData[i] = imgData[i]
            outData[i+1] = imgData[i+1]
            outData[i+2] = imgData[i+2]
            outData[i+3] = imgData[i+3]
            if(imgData[i] === basePrimaryColor.r &&
                imgData[i+1] === basePrimaryColor.g &&
                imgData[i+2] === basePrimaryColor.b){
                    outData[i] = color.r;
                    outData[i+1] = color.g;
                    outData[i+2] = color.b;
                }

            else if(imgData[i] === baseSecondaryColor.r &&
                imgData[i+1] === baseSecondaryColor.g &&
                imgData[i+2] === baseSecondaryColor.b){
                    outData[i] = Math.max(10, color2.r);
                    outData[i+1] = Math.max(10, color2.g);
                    outData[i+2] = Math.max(10, color2.b);
                }
            
            
            else if(imgData[i] === baseThirdColor.r &&
                imgData[i+1] === baseThirdColor.g &&
                imgData[i+2] === baseThirdColor.b){
                    outData[i] = Math.max(10, shadowColor.r);
                    outData[i+1] = Math.max(10, shadowColor.g);
                    outData[i+2] = Math.max(10, shadowColor.b);
                }
        }

        return outData;
    }


    static rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
    
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
    
        var d = max - min;
        s = max == 0 ? 0 : d / max;
    
        if (max == min) {
        h = 0; // achromatic
        } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
    
        h /= 6;
        }
    
        return {h, s, v};
    }
  

    static hsvToRgb(h, s, v) {
        var r, g, b;
    
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
    
        switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        }
    
        return {r: r * 255,g: g * 255,b: b * 255 };
    }

     
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}