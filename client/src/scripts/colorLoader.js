

export default class ColorLoader {

    static async getSpriteSheets(scene,url,prefix, colors, sizeInfo, basePrimaryColor='#b3202a', baseSecondaryColor='#73172d'){

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
    
    
                document.body.appendChild(canvas);
                document.body.appendChild(editCanvas)
    
                let ctx = canvas.getContext('2d');
                let editCtx = editCanvas.getContext('2d');
    
                ctx.drawImage(img, 0, 0);
                let imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    
                
    
                for(const color of colors){
                    let promise = new Promise((resolve, reject) => {
                        this.editPixels(imgData.data, hexToRgb(color), hexToRgb(basePrimaryColor), hexToRgb(baseSecondaryColor));
                        editCtx.putImageData(imgData, 0, 0);
                        let newImg = new Image();
    
                        newImg.onload = () => {
                            scene.textures.addSpriteSheet('tank-'+color, newImg, sizeInfo);
                            resolve();
                        }
    
                        newImg.src = editCanvas.toDataURL();
                    })
    
                    await promise;  
                    console.log('color: ', color, ' loaded');
                };
                
    
                // console.log('draw');
                //canvas.remove();
                //editCanvas.remove();
                res();
            }
    
            img.src = url;
        })

        await mainPromise;
        

    }

    static editPixels(imgData, color, basePrimaryColor, baseSecondaryColor){
        const brightnessDecrase = 20
        for(let i = 0; i < imgData.length; i+=4){
            if(imgData[i] === basePrimaryColor.r &&
                imgData[i+1] === basePrimaryColor.g &&
                imgData[i+2] === basePrimaryColor.b){
                    imgData[i] = color.r;
                    imgData[i+1] = color.g;
                    imgData[i+2] = color.b;
                }

            if(imgData[i] === baseSecondaryColor.r &&
                imgData[i+1] === baseSecondaryColor.g &&
                imgData[i+2] === baseSecondaryColor.b){
                    imgData[i] = Math.max([10, color.r-brightnessDecrase]);
                    imgData[i+1] = Math.max([10, color.g-brightnessDecrase]);
                    imgData[i+2] = Math.max([10, color.b-brightnessDecrase]);
                }
        }
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