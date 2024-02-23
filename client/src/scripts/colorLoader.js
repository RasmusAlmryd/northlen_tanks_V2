

export default class ColorLoader {

    static getSprites(scene,url,prefix, colors, basePrimaryColor='#b3202a', baseSecondaryColor='#73172d'){
        let img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            document.body.appendChild(canvas);

            let ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0,0,canvas.width,canvas.height);

            colors.forEach(color => {
                this.editPixels(imgData.data, hexToRgb(color), hexToRgb(basePrimaryColor), hexToRgb(baseSecondaryColor));
                ctx.putImageData(imgData, 0, 0);
            });
            

            // console.log('draw');
        }

        img.src = url;

    }

    static editPixels(imgData, color, basePrimaryColor, baseSecondaryColor){
        for(let i = 0; i < imgData.length; i+=4){
            if(imgData[i] == basePrimaryColor.r &&
                imgData[i+1] == basePrimaryColor.g &&
                imgData[i+2] == basePrimaryColor.b){
                    imgData[i] = color.r;
                    imgData[i+1] = color.g;
                    imgData[i+2] = color.b;
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