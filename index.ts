type Position3d = {
  x: number
  y: number
  z: number
};

type Sprite = {
  pos: Position3d
  img: ImageBitmap
};

type Position2d = {
  x: number
  y: number
}

const width = 32;
const height = 32;

const SIZE = 10;

const sprites: Array<Sprite> = [];


const projectISOtoScreen: (p: Position3d) => Position2d  = p => {
  return {
    x: p.x * width * 0.5 - p.y * width * 0.5 - width * 0.5 + SIZE * 0.5 * width,
    y: 0.25 * p.x * height + 0.25 * p.y * height - p.z * height * 0.5
  }
};

const canvas = <HTMLCanvasElement | null>document.getElementById("main");
const image = new Image();
if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.addEventListener("mousemove", (event) => {
    const y = (4 * event.offsetY - (height * event.offsetX * 2) / width + (SIZE + 1) * height) / (2 * height);
    const x = (event.offsetX * 2) / width + y - SIZE - 1;

    //console.log(Math.floor(x),Math.floor(y - 1));
  })

  if (ctx) {
    image.onload = async function () {
      const grass = await createImageBitmap(image, 0, 0, width, height);
      const cube = await createImageBitmap(image, width, 0, width, height);
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          sprites.push({
            pos: {
              x: i,
              y: j,
              z: 0
            },
            img: cube
          });
        }
      }

      sprites.push({
        pos: {
          x: 3, y: 3, z: 1
        },
        img: cube
      });
      sprites.push({
        pos: {
          x: 3, y: 3, z: 2
        },
        img: cube
      });
      sprites.push({
        pos: {
          x: 5.5, y: 7.5, z: 1
        },
        img: cube
      });

      sprites.push({
        pos: {
          x: 1, y: 2, z: 1
        },
        img: cube
      });

      sprites.sort((a, b) => {
        const aProjected = Math.ceil(a.pos.x) + Math.ceil(a.pos.y);
        const bProjected = Math.ceil(b.pos.x) + Math.ceil(b.pos.y);

        if (aProjected < bProjected) {
          return -1;
        } else if (aProjected > bProjected) {
          return 1;
        } else {
          if (a.pos.z < b.pos.z) { return -1 } else if (a.pos.z > b.pos.z) { return 1 } else {return 0};
        }
      });

      for (let s of sprites) {
        const projected = projectISOtoScreen(s.pos);
        ctx.drawImage(s.img, projected.x, projected.y);
      }
    };
  }
}

// Load the sprite sheet from an image file
image.src = 'grass.png';
