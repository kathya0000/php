/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';

@Injectable()
export class ProjectsCanvasUtilService extends AbstractService {
  // -----------------------------------------------------------------------------------------

  constructor() {
    super();
  }

  // -----------------------------------------------------------------------------------------

  public getSpaceDesignCanvas(
    spaceData: any,
    maxCanvasWidth: number = 1000
  ): HTMLCanvasElement | null {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const { max_x, max_y, min_x, min_y } =
        this.calculateSpaceDesign_Max_Min_X_Y(spaceData.walls, spaceData.doors);

      // this.logger.console.debug('Max, Min', max_x, max_y, min_x, min_y);

      const max = Math.max(
        1,
        Math.max(Math.abs(max_x - min_x), Math.abs(max_y - min_y))
      );

      const prop = (maxCanvasWidth - 200) / max;

      const canvas_width = Math.abs(max_x - min_x) * prop + 200;
      const canvas_height = Math.abs(max_y - min_y) * prop + 200;

      ctx.canvas.width = maxCanvasWidth; // canvas_width;
      ctx.canvas.height = canvas_height; // maxCanvasWidth; // canvas_height;

      const corner_x = 100 + (maxCanvasWidth - canvas_width) / 2,
        corner_y = 125; // + (maxCanvasWidth - canvas_height) / 2;

      const translation_x = min_x < 0 ? -1 * min_x * prop : 0,
        translation_y = min_y < 0 ? -1 * min_y * prop : 0;

      const x = corner_x + translation_x,
        y = corner_y + translation_y;

      // floor

      this.drawSpaceBorders(
        ctx,
        spaceData,
        spaceData.walls,
        x,
        y,
        prop,
        max_x,
        max_y,
        min_x,
        min_y
      );

      // floor center

      this.drawSpaceBordersCenter(
        ctx,
        spaceData.walls,
        x,
        y,
        prop,
        max_x,
        max_y,
        min_x,
        min_y
      );

      // doors

      this.drawSpaceDoors(ctx, spaceData.walls, spaceData.doors, x, y, prop);

      // windows

      this.drawSpaceWindows(
        ctx,
        spaceData.walls,
        spaceData.windows,
        x,
        y,
        prop
      );

      // numbers delimitations

      this.drawSpaceNumbersDelimitations(
        ctx,
        spaceData,
        spaceData.walls,
        spaceData.doors,
        spaceData.windows,
        spaceData.modules,
        x,
        y,
        prop,
        max_x,
        max_y,
        min_x,
        min_y
      );

      // letters

      this.drawSpaceLetters(
        ctx,
        spaceData,
        spaceData.walls,
        x,
        y,
        prop,
        max_x,
        max_y,
        min_x,
        min_y
      );
    }

    return ctx ? canvas : null;
  }

  private calculateSpaceDesign_Max_Min_X_Y(
    walls: any[],
    doors: any[]
  ): { max_x: number; max_y: number; min_x: number; min_y: number } {
    let max_x = Number.MIN_SAFE_INTEGER,
      max_y = Number.MIN_SAFE_INTEGER;
    let min_x = Number.MAX_SAFE_INTEGER,
      min_y = Number.MAX_SAFE_INTEGER;

    let x = 0,
      y = 0;

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);

      degrees += 180 - wall.wall_angle;

      const x0 = x,
        y0 = y;

      const x1 =
          index === walls.length - 1
            ? 0
            : x0 + wall_width * Math.cos((degrees * Math.PI) / 180),
        y1 =
          index === walls.length - 1
            ? 0
            : y0 + wall_width * Math.sin((degrees * Math.PI) / 180);

      /*this.logger.console.debug(
        'Wall',
        index,
        wall.wall_identifier,
        ' [',
        wall_width,
        wall.angle,
        '] -> (',
        x0,
        ',',
        y0,
        ') -> (',
        x1,
        ',',
        y1,
        ')'
      );*/

      x = x1;
      y = y1;

      max_x = Math.max(max_x, x);
      max_y = Math.max(max_y, y);

      min_x = Math.min(min_x, x);
      min_y = Math.min(min_y, y);

      if (wall_width > 0) {
        doors.forEach((door, index2: number) => {
          if (
            wall.wall_identifier === door.door_wall_identifier &&
            door.door_opening_direction.startsWith('OUT')
          ) {
            const door_left_width = Number.parseFloat(
              '' + door.door_left_width
            );

            const door_width = Number.parseFloat('' + door.door_width);

            const xd0 = x0 + ((x1 - x0) * door_left_width) / wall_width;
            const yd0 = y0 + ((y1 - y0) * door_left_width) / wall_width;

            const xd1 =
              x0 + ((x1 - x0) * (door_left_width + door_width)) / wall_width;
            const yd1 =
              y0 + ((y1 - y0) * (door_left_width + door_width)) / wall_width;

            const door_dif_x = Math.abs(xd0 - xd1);
            const door_dif_y = Math.abs(yd0 - yd1);

            max_x = Math.max(max_x, xd0 + door_dif_y, xd1 + door_dif_y);
            max_y = Math.max(max_y, yd0 + door_dif_x, yd1 + door_dif_x);

            min_x = Math.min(min_x, xd0 - door_dif_y, xd1 - door_dif_y);
            min_y = Math.min(min_y, yd0 - door_dif_x, yd1 - door_dif_x);
          }
        });
      }
    });

    return { max_x, max_y, min_x, min_y };
  }

  private drawSpaceBorders(
    ctx: CanvasRenderingContext2D,
    spaceData: any,
    walls: any[],
    xi: number,
    yi: number,
    prop: number,
    max_x: number,
    max_y: number,
    min_x: number,
    min_y: number
  ): void {
    ctx.save();

    ctx.strokeStyle = '#000000';

    ctx.fillStyle = '#FFFFFF';

    ctx.beginPath();

    let x = xi,
      y = yi;

    let min2_x = xi,
      min2_y = yi,
      max2_x = xi,
      max2_y = yi;

    ctx.moveTo(x + 0, y + 0);

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      if (x < min2_x) {
        min2_x = x;
      }
      if (y < min2_y) {
        min2_y = y;
      }
      if (x > max2_x) {
        max2_x = x;
      }
      if (y > max2_y) {
        max2_y = y;
      }

      ctx.lineTo(x, y);
    });

    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawSpaceBordersCenter(
    ctx: CanvasRenderingContext2D,
    walls: any[],
    xi: number,
    yi: number,
    prop: number,
    max_x: number,
    max_y: number,
    min_x: number,
    min_y: number
  ): void {
    ctx.save();

    let x = xi,
      y = yi;

    let sx = 0,
      sy = 0;

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      sx += x;
      sy += y;

      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);
    });

    sx = walls.length > 2 ? sx / walls.length : 0;
    sy = walls.length > 2 ? sy / walls.length : 0;

    /*

    ctx.beginPath();
    ctx.strokeStyle = '#00000';
    ctx.fillStyle = '#00000';
    ctx.arc(sx, sy, 8, 0, (360 * Math.PI) / 180);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    */
    ctx.restore();
  }

  private drawSpaceDoors(
    ctx: CanvasRenderingContext2D,
    walls: any[],
    doors: any[],
    xi: number,
    yi: number,
    prop: number
  ): void {
    ctx.save();

    let x = xi,
      y = yi;

    ctx.moveTo(x + 0, y + 0);

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      degrees += 180 - wall.wall_angle;

      const x0 = x,
        y0 = y;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      const x1 = x,
        y1 = y;

      doors.forEach((door, index2: number) => {
        if (wall.wall_identifier === door.door_wall_identifier) {
          const door_left_width = Number.parseFloat('' + door.door_left_width);
          const door_left_width_prop = door_left_width * prop;

          const door_width = Number.parseFloat('' + door.door_width);
          const door_width_prop = door_width * prop;

          const xd0 = x0 + ((x1 - x0) * door_left_width_prop) / wall_width_prop;
          const yd0 = y0 + ((y1 - y0) * door_left_width_prop) / wall_width_prop;

          const xd1 =
            x0 +
            ((x1 - x0) * (door_left_width_prop + door_width_prop)) /
              wall_width_prop;
          const yd1 =
            y0 +
            ((y1 - y0) * (door_left_width_prop + door_width_prop)) /
              wall_width_prop;

          // arco de la puerta

          ctx.beginPath();
          ctx.strokeStyle = '#b1b7c1';
          ctx.fillStyle = '#b1b7c1';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 3]);
          if (
            door.door_opening_direction.startsWith('IN_') &&
            door.door_opening_direction.endsWith('_LEFT')
          ) {
            ctx.moveTo(xd1, yd1);
            ctx.arc(
              xd1,
              yd1,
              door_width_prop,
              ((0 + degrees + 90) * Math.PI) / 180, // + 30
              ((0 + degrees + 180) * Math.PI) / 180,
              false
            );
          } else if (
            door.door_opening_direction.startsWith('IN_') &&
            door.door_opening_direction.endsWith('_RIGHT')
          ) {
            ctx.moveTo(xd0, yd0);
            ctx.arc(
              xd0,
              yd0,
              door_width_prop,
              ((0 + degrees + 90) * Math.PI) / 180, // - 30
              ((0 + degrees + 0) * Math.PI) / 180,
              true
            );
          } else if (
            door.door_opening_direction.startsWith('OUT_') &&
            door.door_opening_direction.endsWith('_LEFT')
          ) {
            ctx.moveTo(xd1, yd1);
            ctx.arc(
              xd1,
              yd1,
              door_width_prop,
              ((0 + degrees - 90) * Math.PI) / 180, // - 30
              ((0 + degrees - 180) * Math.PI) / 180,
              true
            );
          } else if (
            door.door_opening_direction.startsWith('OUT_') &&
            door.door_opening_direction.endsWith('_RIGHT')
          ) {
            ctx.moveTo(xd0, yd0);
            ctx.arc(
              xd0,
              yd0,
              door_width_prop,
              ((0 + degrees - 90) * Math.PI) / 180, // + 30
              ((0 + degrees - 0) * Math.PI) / 180,
              false
            );
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.closePath();

          // puntos para delimitar los marcos

          ctx.beginPath();
          ctx.strokeStyle = '#0a108f';
          ctx.fillStyle = '#0a108f';
          ctx.moveTo(xd0, yd0);
          ctx.arc(xd0, yd0, 4, 0, (360 * Math.PI) / 180);
          ctx.fill();
          ctx.moveTo(xd1, yd1);
          ctx.arc(xd1, yd1, 4, 0, (360 * Math.PI) / 180);
          ctx.fill();
          ctx.closePath();

          // linea de la puerta sobre la pared

          ctx.beginPath();
          ctx.strokeStyle = '#0a108f';
          ctx.fillStyle = '#0a108f';
          ctx.lineWidth = 6;
          // ctx.setLineDash([8, 3]);
          ctx.setLineDash([]);
          ctx.moveTo(xd0, yd0);
          ctx.lineTo(xd1, yd1);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.closePath();
        }
      });

      // ctx.lineTo(x, y);
    });

    ctx.restore();
  }

  private drawSpaceWindows(
    ctx: CanvasRenderingContext2D,
    walls: any[],
    windows: any[],
    xi: number,
    yi: number,
    prop: number
  ): void {
    ctx.save();

    let x = xi,
      y = yi;

    ctx.moveTo(x + 0, y + 0);

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      degrees += 180 - wall.wall_angle;

      const x0 = x,
        y0 = y;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      const x1 = x,
        y1 = y;

      windows.forEach((window, index2: number) => {
        if (wall.wall_identifier === window.window_wall_identifier) {
          const window_left_width = Number.parseFloat(
            '' + window.window_left_width
          );
          const window_left_width_prop = window_left_width * prop;

          const window_width = Number.parseFloat('' + window.window_width);
          const window_width_prop = window_width * prop;

          const xd0 =
            x0 + ((x1 - x0) * window_left_width_prop) / wall_width_prop;
          const yd0 =
            y0 + ((y1 - y0) * window_left_width_prop) / wall_width_prop;

          const xd1 =
            x0 +
            ((x1 - x0) * (window_left_width_prop + window_width_prop)) /
              wall_width_prop;
          const yd1 =
            y0 +
            ((y1 - y0) * (window_left_width_prop + window_width_prop)) /
              wall_width_prop;

          // puntos para delimitar los marcos

          ctx.beginPath();
          ctx.strokeStyle = '#0a108f';
          ctx.fillStyle = '#0a108f';
          ctx.moveTo(xd0, yd0);
          ctx.arc(xd0, yd0, 4, 0, (360 * Math.PI) / 180);
          ctx.fill();
          ctx.moveTo(xd1, yd1);
          ctx.arc(xd1, yd1, 4, 0, (360 * Math.PI) / 180);
          ctx.fill();
          ctx.closePath();

          // linea de la ventana

          ctx.beginPath();
          ctx.strokeStyle = '#0a108f';
          ctx.fillStyle = '#0a108f';
          ctx.lineWidth = 6;
          ctx.moveTo(xd0, yd0);
          ctx.lineTo(xd1, yd1);
          ctx.stroke();
          ctx.closePath();
        }
      });

      // ctx.lineTo(x, y);
    });

    ctx.restore();
  }

  private drawSpaceNumbersDelimitations(
    ctx: CanvasRenderingContext2D,
    spaceData: any,
    walls: any[],
    doors: any[],
    windows: any[],
    modules: any[],
    xi: number,
    yi: number,
    prop: number,
    max_x: number,
    max_y: number,
    min_x: number,
    min_y: number
  ): void {
    ctx.save();

    let x = xi,
      y = yi;

    let min2_x = xi,
      min2_y = yi,
      max2_x = xi,
      max2_y = yi;

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      if (x < min2_x) {
        min2_x = x;
      }
      if (y < min2_y) {
        min2_y = y;
      }
      if (x > max2_x) {
        max2_x = x;
      }
      if (y > max2_y) {
        max2_y = y;
      }
    });

    (x = xi), (y = yi);

    degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      const x0 = x,
        y0 = y;

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      const x1 = x,
        y1 = y;

      const wall_doors = doors.filter(
        (door) => door.door_wall_identifier === wall.wall_identifier
      );
      const wall_windows = windows.filter(
        (window) => window.window_wall_identifier === wall.wall_identifier
      );
      const wall_modules = modules.filter(
        (module) => module.module_wall_identifier === wall.wall_identifier
      );

      if (
        wall_doors.length + wall_windows.length /* + wall_modules.length*/ >
        0
      ) {
        const delimitations: any[] = [];

        wall_doors.forEach((door) => {
          delimitations.push({
            left: Number.parseFloat(door.door_left_width),
            height: 0,
          });
          delimitations.push({
            left:
              Number.parseFloat(door.door_left_width) +
              Number.parseFloat(door.door_width),
            height: 0,
          });
        });

        wall_windows.forEach((window) => {
          delimitations.push({
            left: Number.parseFloat(window.window_left_width),
            height: Number.parseFloat(window.window_under_height),
          });
          delimitations.push({
            left:
              Number.parseFloat(window.window_left_width) +
              Number.parseFloat(window.window_width),
            height: Number.parseFloat(window.window_under_height),
          });
        });

        delimitations.sort(function (a, b) {
          if (a.left > b.left) {
            return 1;
          }
          if (a.left < b.left) {
            return -1;
          }
          return 0;
        });

        delimitations.forEach((delimitation, index2) => {
          const prev = Number.parseFloat(
            index2 === 0 ? 0 : delimitations[index2 - 1].left
          );
          const current = Number.parseFloat(delimitations[index2].left);
          ctx.font = 'bold 20px serif';
          ctx.strokeStyle = '#74777d';
          ctx.fillStyle = '#74777d';

          if (current - prev !== 0) {
            const xd =
              x0 + (((prev + current) / 2) * (x1 - x0)) / wall.wall_width;
            const yd =
              y0 + (((prev + current) / 2) * (y1 - y0)) / wall.wall_width;

            const m = x0 !== x1 ? (y0 - y1) / (x0 - x1) : null;

            if (m === null || Math.abs(m) >= 1) {
              // vertical
              if (xd <= (min2_x + max2_x) / 2) {
                ctx.fillText('' + (current - prev), xd + 10, yd + 5);
              } else {
                ctx.fillText('' + (current - prev), xd - 50, yd + 5);
              }
            } else if (m !== null && Math.abs(m) <= 1) {
              // horizontal
              if (yd < (min2_y + max2_y) / 2) {
                ctx.fillText('' + (current - prev), xd - 15, yd + 20);
              } else {
                ctx.fillText('' + (current - prev), xd - 15, yd - 10);
              }
            }
          }
          if (index2 === delimitations.length - 1) {
            const last = Number.parseFloat(wall.wall_width);
            if (last - current !== 0) {
              const xd =
                x0 + (((last + current) / 2) * (x1 - x0)) / wall.wall_width;
              const yd =
                y0 + (((last + current) / 2) * (y1 - y0)) / wall.wall_width;

              const m = x0 !== x1 ? (y0 - y1) / (x0 - x1) : null;

              if (m === null || Math.abs(m) >= 1) {
                // vertical
                if (xd <= (min2_x + max2_x) / 2) {
                  ctx.fillText('' + (last - current), xd + 10, yd + 5);
                } else {
                  ctx.fillText('' + (last - current), xd - 50, yd + 5);
                }
              } else if (m !== null && Math.abs(m) <= 1) {
                // horizontal
                if (yd < (min2_y + max2_y) / 2) {
                  ctx.fillText('' + (last - current), xd - 15, yd + 20);
                } else {
                  ctx.fillText('' + (last - current), xd - 15, yd - 10);
                }
              }
            }
          }

          ctx.closePath();
        });
      }
    });

    ctx.restore();
  }

  private drawSpaceLetters(
    ctx: CanvasRenderingContext2D,
    spaceData: any,
    walls: any[],
    xi: number,
    yi: number,
    prop: number,
    max_x: number,
    max_y: number,
    min_x: number,
    min_y: number
  ): void {
    ctx.save();

    let x = xi,
      y = yi;

    let min2_x = xi,
      min2_y = yi,
      max2_x = xi,
      max2_y = yi;

    let degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      if (x < min2_x) {
        min2_x = x;
      }
      if (y < min2_y) {
        min2_y = y;
      }
      if (x > max2_x) {
        max2_x = x;
      }
      if (y > max2_y) {
        max2_y = y;
      }
    });

    // space area

    ctx.beginPath();
    ctx.font = 'bold 30px serif';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';

    ctx.fillText(
      (spaceData.space_floor_area / 1000000).toFixed(2) + ' m^2',
      (max2_x + min2_x) / 2 - 50,
      yi - 60
    );

    ctx.stroke();
    ctx.closePath();

    // corners letters

    (x = xi), (y = yi);

    degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      const cornerId = (wall.wall_identifier + '-').split('-')[0].trim();

      let x1 = x,
        y1 = y;

      if (x1 < (max2_x + min2_x) / 2) {
        x1 = x1 - 10;
      } else if (x1 > (max2_x + min2_x) / 2) {
        x1 = x1 - 8;
      }

      if (y1 < (max2_y + min2_y) / 2) {
        y1 = y1 - 10;
      } else if (y1 > (max2_y + min2_y) / 2) {
        y1 = y1 + 30;
      }

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      ctx.beginPath();
      ctx.font = 'bold 28px serif';
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#000000';
      ctx.fillText(cornerId, x1, y1);
      ctx.stroke();
      ctx.closePath();
    });

    // walls dimensions

    (x = xi), (y = yi);

    degrees = -1 * (180 - (walls.length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);
      const wall_width_prop = wall_width * prop;

      const wWidth = '' + wall_width; // + ' - ' + wall_width_prop; // + ' cm'; // .toFixed(2);

      const x0 = x,
        y0 = y;

      degrees += 180 - wall.wall_angle;

      x += wall_width_prop * Math.cos((degrees * Math.PI) / 180);
      y += wall_width_prop * Math.sin((degrees * Math.PI) / 180);

      const x1 = x,
        y1 = y;

      const m = x0 !== x1 ? (y0 - y1) / (x0 - x1) : null;

      // this.logger.console.debug(wall.wall_identifier, wWidth, x0, y0, x1, y1, m);

      ctx.beginPath();
      ctx.font = 'bold 24px serif';
      ctx.strokeStyle = '#ff0000';
      ctx.fillStyle = '#ff0000';

      if (m === null || Math.abs(m) >= 1) {
        // vertical
        if ((x0 + x1) / 2 <= (min2_x + max2_x) / 2) {
          ctx.fillText(wWidth, (x0 + x1) / 2 - 70, (y0 + y1) / 2 + 5);
        } else {
          ctx.fillText(wWidth, (x0 + x1) / 2 + 20, (y0 + y1) / 2 + 5);
        }
      } else if (m !== null && Math.abs(m) <= 1) {
        // horizontal
        if ((y0 + y1) / 2 < (min2_y + max2_y) / 2) {
          ctx.fillText(wWidth, (x0 + x1) / 2 - 30, (y0 + y1) / 2 - 25);
        } else {
          ctx.fillText(wWidth, (x0 + x1) / 2 - 30, (y0 + y1) / 2 + 40);
        }
      }

      ctx.stroke();
      ctx.closePath();
    });

    ctx.restore();
  }

  // -----------------------------------------------------------------------------------------

  public getWallDesignCanvas(
    spaceData: any,
    wallData: any,
    maxCanvasWidth: number = 1000
  ): HTMLCanvasElement | null {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const max = Math.max(
        1,
        this.calculateWallDesign_Max_Min_Wall_Width(spaceData.walls)
      );

      const prop = (maxCanvasWidth - 200) / max;

      const canvas_width = Math.abs(wallData.wall_width) * prop + 200;
      const canvas_height = Math.abs(wallData.wall_height) * prop + 200;

      ctx.canvas.width = maxCanvasWidth; // canvas_width;
      ctx.canvas.height = canvas_height; // maxCanvasWidth; // canvas_height;

      const corner_x = 100 + (maxCanvasWidth - canvas_width) / 2,
        corner_y = 125; // + (maxCanvasWidth - canvas_height) / 2;

      // walls

      this.drawWallBorders(ctx, wallData, corner_x, corner_y, prop);

      // doors

      this.drawWallDoors(
        ctx,
        wallData,
        spaceData.doors,
        corner_x,
        corner_y,
        prop
      );

      // windows

      this.drawWallWindows(
        ctx,
        wallData,
        spaceData.windows,
        corner_x,
        corner_y,
        prop
      );

      // modules

      this.drawWallModules(
        ctx,
        wallData,
        spaceData.modules,
        corner_x,
        corner_y,
        prop
      );

      // numbers delimitations

      this.drawWallNumbersDelimitations(
        ctx,
        wallData,
        spaceData.doors,
        spaceData.windows,
        spaceData.modules,
        corner_x,
        corner_y,
        prop
      );

      // letters

      this.drawWallLetters(ctx, wallData, corner_x, corner_y, prop);
    }

    return ctx ? canvas : null;
  }

  private calculateWallDesign_Max_Min_Wall_Width(walls: any[]): number {
    let max = Number.MIN_SAFE_INTEGER;

    walls.forEach((wall) => {
      max = Math.max(max, Math.max(wall.wall_width, wall.wall_height));
    });

    return max;
  }

  private drawWallBorders(
    ctx: CanvasRenderingContext2D,
    wall: any,
    xi: number,
    yi: number,
    prop: number
  ): void {
    ctx.save();

    ctx.strokeStyle = '#000000';

    ctx.fillStyle = '#FFFFFF';

    ctx.beginPath();

    let x = xi,
      y = yi;

    ctx.moveTo(x + 0, y + 0);
    x = x + wall.wall_width * prop;
    y = y + 0;
    ctx.lineTo(x, y);

    // ctx.moveTo(x + 0, y + 0);
    x = x + 0;
    y = y + wall.wall_height * prop;
    ctx.lineTo(x, y);

    // ctx.moveTo(x + 0, y + 0);
    x = x - wall.wall_width * prop;
    y = y + 0;
    ctx.lineTo(x, y);

    // ctx.moveTo(x + 0, y + 0);
    x = x + 0;
    y = y - wall.wall_height * prop;
    ctx.lineTo(x, y);

    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawWallDoors(
    ctx: CanvasRenderingContext2D,
    wall: any,
    doors: any[],
    xi: number,
    yi: number,
    prop: number
  ): void {
    ctx.save();

    doors
      .filter((door) => door.door_wall_identifier === wall.wall_identifier)
      .forEach((door) => {
        let x = xi,
          y = yi;

        ctx.strokeStyle = '#0a108f'; // '#b1b7c1';
        ctx.fillStyle = '#FFFFFF'; // '#b1b7c1';

        ctx.beginPath();
        ctx.lineWidth = 4;

        ctx.moveTo(x + 0, y + 0);
        x = x + 0;
        y = y + wall.wall_height * prop;

        x = x + door.door_left_width * prop;
        y = y + 0;

        ctx.moveTo(x + 0, y + 0);
        x = x + 0;
        y = y - door.door_height * prop;
        ctx.lineTo(x, y);

        // ctx.moveTo(x + 0, y + 0);
        x = x + door.door_width * prop;
        y = y + 0;
        ctx.lineTo(x, y);

        // ctx.moveTo(x + 0, y + 0);
        x = x + 0;
        y = y + door.door_height * prop;
        ctx.lineTo(x, y);

        // ctx.moveTo(x + 0, y + 0);
        x = x - door.door_width * prop;
        y = y + 0;
        // ctx.lineTo(x, y);

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // door handle

        ctx.strokeStyle = '#0a108f'; // '#b1b7c1';
        ctx.fillStyle = '#0a108f'; // '#b1b7c1';

        ctx.beginPath();
        ctx.lineWidth = 2;

        if (
          door.door_opening_direction === 'IN_LEFT' ||
          door.door_opening_direction === 'OUT_LEFT'
        ) {
          x = x + 20;
          y = y - (door.door_height * prop) / 2 + 20;
          ctx.moveTo(x + 0, y + 0);
          ctx.arc(x, y, 5, 0, (360 * Math.PI) / 180);
          ctx.fill();
        }

        if (
          door.door_opening_direction === 'IN_RIGHT' ||
          door.door_opening_direction === 'OUT_RIGHT'
        ) {
          x = x - 20 + door.door_width * prop;
          y = y - (door.door_height * prop) / 2 + 20;
          ctx.moveTo(x + 0, y + 0);
          ctx.arc(x, y, 5, 0, (360 * Math.PI) / 180);
          ctx.fill();
        }

        ctx.closePath();

        ctx.stroke();
      });

    ctx.restore();
  }

  private drawWallWindows(
    ctx: CanvasRenderingContext2D,
    wall: any,
    windows: any[],
    xi: number,
    yi: number,
    prop: number
  ): void {
    ctx.save();

    windows
      .filter(
        (window) => window.window_wall_identifier === wall.wall_identifier
      )
      .forEach((window) => {
        let x = xi,
          y = yi;

        // window borders

        ctx.strokeStyle = '#0a108f'; // '#b1b7c1';
        ctx.fillStyle = '#FFFFFF'; // '#b1b7c1';

        ctx.beginPath();
        ctx.lineWidth = 3;

        ctx.moveTo(x + 0, y + 0);
        x = x + 0;
        y = y + wall.wall_height * prop;

        x = x + window.window_left_width * prop;
        y = y - window.window_under_height * prop;

        ctx.moveTo(x + 0, y + 0);
        x = x + 0;
        y = y - window.window_height * prop;
        ctx.lineTo(x, y);

        // ctx.moveTo(x + 0, y + 0);
        x = x + window.window_width * prop;
        y = y + 0;
        ctx.lineTo(x, y);

        // ctx.moveTo(x + 0, y + 0);
        x = x + 0;
        y = y + window.window_height * prop;
        ctx.lineTo(x, y);

        // ctx.moveTo(x + 0, y + 0);
        x = x - window.window_width * prop;
        y = y + 0;
        ctx.lineTo(x, y);

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // window interior separator

        ctx.strokeStyle = '#b1b7c1';
        ctx.fillStyle = '#b1b7c1';

        ctx.setLineDash([8, 5]);

        ctx.beginPath();
        ctx.lineWidth = 1;

        // vertical line
        ctx.moveTo(x + (window.window_width / 2) * prop, y + 0);
        ctx.lineTo(
          x + (window.window_width / 2) * prop,
          y + 0 - window.window_height * prop
        );

        // horizontal line
        ctx.moveTo(x + 0, y + 0 - (window.window_height / 2) * prop);
        ctx.lineTo(
          x + window.window_width * prop,
          y + 0 - (window.window_height / 2) * prop
        );

        ctx.closePath();

        ctx.stroke();
        ctx.setLineDash([]);
      });

    ctx.restore();
  }

  private drawWallModules(
    ctx: CanvasRenderingContext2D,
    wall: any,
    modules: any[],
    xi: number,
    yi: number,
    prop: number
  ): void {
    ctx.save();

    modules
      .filter(
        (module) => module.module_wall_identifier === wall.wall_identifier
      )
      .forEach((module) => {
        let x = xi,
          y = yi;

        const mechanism_width = 90;
        const mechanism_height = 90;

        const module_width =
          module.mechanisms && module.mechanisms.length > 0
            ? module.mechanisms.length * mechanism_width
            : mechanism_width;
        const module_height = mechanism_height;

        const module_trench_separation = 30;

        // module

        if (module.module_make_new_installation === true) {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#FFFFFF';
        } else {
          ctx.strokeStyle = '#0a108f'; // '#b1b7c1';
          ctx.fillStyle = '#FFFFFF';
        }

        ctx.beginPath();

        ctx.lineWidth = 3;

        ctx.moveTo(x + 0, y + 0);

        x = x + 0;
        y = y + wall.wall_height * prop;

        x =
          x +
          (module.module_wall_identifier.startsWith(
            module.module_reference_point
          )
            ? module.module_distance_to_reference_point * prop
            : wall.wall_width * prop -
              module.module_distance_to_reference_point * prop -
              module_width * prop);
        y = y - module.module_bottom_height * prop;

        ctx.moveTo(x + 0, y + 0);
        ctx.lineTo(x, y - module_height * prop);
        x = x + 0;
        y = y - module_height * prop;

        // ctx.moveTo(x + 0, y + 0);
        ctx.lineTo(x + module_width * prop, y);
        x = x + module_width * prop;
        y = y + 0;

        // ctx.moveTo(x + 0, y + 0);
        ctx.lineTo(x, y + module_height * prop);
        x = x + 0;
        y = y + module_height * prop;

        // ctx.moveTo(x + 0, y + 0);
        ctx.lineTo(x - module_width * prop, y);
        x = x - module_width * prop;
        y = y + 0;

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // module mechanisms separations

        module.mechanisms.forEach((mechanism: any, index2: number) => {
          if (index2 < module.mechanisms.length - 1) {
            if (module.module_make_new_installation === true) {
              ctx.strokeStyle = '#ff0000';
              ctx.fillStyle = '#FFFFFF';
            } else {
              ctx.strokeStyle = '#0a108f'; // '#b1b7c1';
              ctx.fillStyle = '#FFFFFF';
            }

            ctx.beginPath();

            ctx.lineWidth = 3;

            ctx.moveTo(x + mechanism_width * (index2 + 1) * prop, y + 0);
            ctx.lineTo(
              x + mechanism_width * (index2 + 1) * prop,
              y - mechanism_height * prop
            );

            ctx.closePath();

            ctx.fill();
            ctx.stroke();
          }
        });

        // trenches

        (x = xi), (y = yi);

        ctx.beginPath();

        ctx.strokeStyle = '#ff0000'; // '#b1b7c1';
        ctx.fillStyle = '#ff0000'; // '#b1b7c1';

        ctx.lineWidth = 2;

        ctx.moveTo(x + 0, y + 0);

        x = x + 0;
        y = y + wall.wall_height * prop;

        x =
          x +
          (module.module_wall_identifier.startsWith(
            module.module_reference_point
          )
            ? module.module_distance_to_reference_point * prop
            : wall.wall_width * prop -
              module.module_distance_to_reference_point * prop -
              module_width * prop);
        y = y - module.module_bottom_height * prop;

        x =
          x +
          (module.module_wall_identifier.startsWith(
            module.module_reference_point
          )
            ? 0
            : module_width) *
            prop;
        y = y - module_height * prop;

        ctx.moveTo(x + 0, y + 0);

        for (let c = 0; c < module.module_trenches_count; c++) {
          const td = module_trench_separation * prop;

          const xd = module.module_wall_identifier.startsWith(
            module.module_reference_point
          )
            ? /* (module.module_trenches_count % 2 === 1 ? 0 : td / 2) -
            Math.floor(module.module_trenches_count / 2) * td + */
              c * td
            : -c * td;

          ctx.moveTo(x + 0 + xd, y + 0);

          const xf = x + 0 + xd;

          const yf = Math.max(
            yi,
            yi
            /* + (wall.wall_height * prop -
                module.module_bottom_height * prop -
                module_height * prop -
                module.module_trenches_top_height * prop)*/
          );

          ctx.lineTo(xf, yf);

          /*
          // not horizontal trench
          if (module.module_trenches_direction !== 'NONE') {
            ctx.moveTo(xf, yf);
            if (module.module_trenches_direction === 'LEFT') {
              ctx.lineTo(xi, yf);
            } else if (module.module_trenches_direction === 'RIGHT') {
              ctx.lineTo(xi + wall.wall_width * prop, yf);
            }
          }
          */
        }

        ctx.closePath();

        ctx.stroke();
      });

    ctx.restore();
  }

  private drawWallNumbersDelimitations(
    ctx: CanvasRenderingContext2D,
    wall: any,
    doors: any[],
    windows: any[],
    modules: any[],
    xi: number,
    yi: number,
    prop: number
  ): void {
    const wall_doors = doors.filter(
      (door) => door.door_wall_identifier === wall.wall_identifier
    );
    const wall_windows = windows.filter(
      (window) => window.window_wall_identifier === wall.wall_identifier
    );
    const wall_modules = modules.filter(
      (module) => module.module_wall_identifier === wall.wall_identifier
    );
    if (wall_doors.length + wall_windows.length + wall_modules.length === 0) {
      return;
    }
    const delimitations: any[] = [];

    wall_doors.forEach((door) => {
      delimitations.push({
        pos_x: Number.parseFloat(door.door_left_width),
        pos_y: 0,
      });

      delimitations.push({
        pos_x:
          Number.parseFloat(door.door_left_width) +
          Number.parseFloat(door.door_width),
        pos_y: 0,
        is_door: true,
        width: door.door_width,
        height: door.door_height,
      });
    });

    wall_windows.forEach((window) => {
      delimitations.push({
        pos_x: Number.parseFloat(window.window_left_width),
        pos_y: Number.parseFloat(window.window_under_height),
      });
      delimitations.push({
        pos_x:
          Number.parseFloat(window.window_left_width) +
          Number.parseFloat(window.window_width),
        pos_y: Number.parseFloat(window.window_under_height),
        is_window: true,
        width: window.window_width,
        height: window.window_height,
      });
    });

    wall_modules.forEach((module) => {
      delimitations.push({
        pos_x: module.module_wall_identifier.startsWith(
          module.module_reference_point
        )
          ? Number.parseFloat(module.module_distance_to_reference_point)
          : Number.parseFloat(wall.wall_width) -
            Number.parseFloat(module.module_distance_to_reference_point),
        pos_y: Number.parseFloat(module.module_bottom_height),
        is_module: true,
        width: 0,
        height:
          Number.parseFloat(wall.wall_width) -
          Number.parseFloat(module.module_bottom_height) -
          90,
        reference: module.module_wall_identifier.startsWith(
          module.module_reference_point
        )
          ? 'LEFT'
          : 'RIGHT',
        trench_count: module.module_trenches_count,
      });
    });

    delimitations.sort(function (a, b) {
      if (a.pos_x > b.pos_x) {
        return 1;
      }
      if (a.pos_x < b.pos_x) {
        return -1;
      }
      return 0;
    });

    delimitations.forEach((delimitation, index) => {
      ctx.beginPath();
      ctx.strokeStyle = '#b1b7c1';
      ctx.fillStyle = '#b1b7c1';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 5]);
      ctx.moveTo(xi + delimitation.pos_x * prop, yi + wall.wall_height * prop);
      ctx.lineTo(
        xi + delimitation.pos_x * prop,
        yi + wall.wall_height * prop - delimitation.pos_y * prop
      );
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.closePath();

      /*
      if (delimitation.is_module) {
        ctx.beginPath();
        ctx.strokeStyle = '#b1b7c1';
        ctx.fillStyle = '#b1b7c1';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 5]);
        ctx.moveTo(
          xi + delimitation.pos_x * prop,
          yi +
            wall.wall_height * prop -
            delimitation.pos_y * prop -
            90 * prop -
            delimitation.height * prop
        );
        ctx.lineTo(xi + delimitation.pos_x * prop, yi);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
      }
      */

      ctx.beginPath();

      const prev = Number.parseFloat(
        index === 0 ? 0 : delimitations[index - 1].pos_x
      );

      const current = Number.parseFloat(delimitations[index].pos_x);
      ctx.font = 'bold 20px serif';
      ctx.strokeStyle = '#74777d';
      ctx.fillStyle = '#74777d';

      // -------------------------------------------
      if (delimitation.is_door) {
        // floor
        ctx.fillText(
          '' + delimitation.width,
          xi +
            (current - Number.parseFloat(delimitation.width) / 2) * prop -
            20,
          yi + wall.wall_height * prop - 10
        );
        // top
        /*
        ctx.fillText(
          '' + delimitation.width,
          xi +
            (current - Number.parseFloat(delimitation.width) / 2) * prop -
            20,
          yi + wall.wall_height * prop - delimitation.height * prop + 25
        );*/
        // left
        ctx.fillText(
          '' + delimitation.height,
          xi + (current - Number.parseFloat(delimitation.width)) * prop + 10,
          yi + wall.wall_height * prop - (delimitation.height / 2) * prop - 10
        );
        // right
        /*
        ctx.fillText(
          '' + delimitation.height,
          xi + current * prop - 50,
          yi + wall.wall_height * prop - (delimitation.height / 2) * prop - 10
        );*/
      }
      // -------------------------------------------
      else if (delimitation.is_window) {
        // floor
        ctx.fillText(
          '' + delimitation.width,
          xi +
            (current - Number.parseFloat(delimitation.width) / 2) * prop -
            20,
          yi + wall.wall_height * prop - 10
        );
        // bottom
        ctx.fillText(
          '' + delimitation.width,
          xi +
            (current - Number.parseFloat(delimitation.width) / 2) * prop -
            20,
          yi +
            wall.wall_height * prop -
            Number.parseFloat(delimitation.pos_y) * prop -
            10
        );
        // top
        /*
        ctx.fillText(
          '' + delimitation.width,
          xi +
            (current - Number.parseFloat(delimitation.width) / 2) * prop -
            20,
          yi +
            wall.wall_height * prop -
            Number.parseFloat(delimitation.pos_y) * prop -
            delimitation.height * prop +
            25
        );*/
        // left
        ctx.fillText(
          '' + delimitation.height,
          xi + (current - Number.parseFloat(delimitation.width)) * prop + 10,
          yi +
            wall.wall_height * prop -
            Number.parseFloat(delimitation.pos_y) * prop -
            (delimitation.height / 2) * prop +
            5
        );
        // right
        /*
        ctx.fillText(
          '' + delimitation.height,
          xi + current * prop - 50,
          yi +
            wall.wall_height * prop -
            Number.parseFloat(delimitation.pos_y) * prop -
            (delimitation.height / 2) * prop +
            5
        );
        */
        // under left
        ctx.fillText(
          '' + delimitation.pos_y,
          xi + (current - Number.parseFloat(delimitation.width)) * prop + 10,
          yi +
            wall.wall_height * prop -
            (Number.parseFloat(delimitation.pos_y) / 2) * prop +
            5
        );
        // under right
        /*
        ctx.fillText(
          '' + delimitation.pos_y,
          xi + current * prop - 50,
          yi +
            wall.wall_height * prop -
            (Number.parseFloat(delimitation.pos_y) / 2) * prop +
            5
        );*/
      }
      // -------------------------------------------
      else if (delimitation.is_module) {
        // bottom
        ctx.fillText(
          '' + (current - prev),
          xi + ((prev + current) / 2) * prop - 20,
          yi + wall.wall_height * prop - 10
        );
        if (delimitation.reference === 'LEFT') {
          // left
          ctx.fillText(
            '' + delimitation.height,
            xi +
              current * prop +
              (delimitation.trench_count - 1) * 30 * prop +
              5,
            yi +
              wall.wall_height * prop -
              Number.parseFloat(delimitation.pos_y) * prop -
              (delimitation.height / 2) * prop -
              5
          );
        } else if (delimitation.reference === 'RIGHT') {
          // right
          ctx.fillText(
            '' + delimitation.height,
            xi +
              current * prop -
              (delimitation.trench_count - 1) * 30 * prop -
              45,
            yi +
              wall.wall_height * prop -
              Number.parseFloat(delimitation.pos_y) * prop -
              (delimitation.height / 2) * prop -
              5
          );
        }
        if (delimitation.reference === 'LEFT') {
          // under left
          ctx.fillText(
            '' + delimitation.pos_y,
            xi + current * prop + 5,
            yi +
              wall.wall_height * prop -
              (Number.parseFloat(delimitation.pos_y) / 2) * prop -
              5
          );
        } else if (delimitation.reference === 'RIGHT') {
          // under right
          ctx.fillText(
            '' + delimitation.pos_y,
            xi + current * prop - 40,
            yi +
              wall.wall_height * prop -
              (Number.parseFloat(delimitation.pos_y) / 2) * prop -
              5
          );
        }
        /*
        if (delimitation.reference === 'LEFT') {
          // top left
          ctx.fillText(
            '' +
              (wall.wall_height -
                Number.parseFloat(delimitation.pos_y) -
                Number.parseFloat(delimitation.height) -
                90),
            xi + current * prop + 5,
            Math.max(
              yi +
                ((wall.wall_height -
                  Number.parseFloat(delimitation.pos_y) -
                  Number.parseFloat(delimitation.height) -
                  90) /
                  2) *
                  prop -
                5,
              yi + 20
            )
          );
        } else if (delimitation.reference === 'RIGHT') {
          // top right
          ctx.fillText(
            '' +
              (wall.wall_height -
                Number.parseFloat(delimitation.pos_y) -
                Number.parseFloat(delimitation.height) -
                90),
            xi + current * prop - 40,
            Math.max(
              yi +
                ((wall.wall_height -
                  Number.parseFloat(delimitation.pos_y) -
                  Number.parseFloat(delimitation.height) -
                  90) /
                  2) *
                  prop -
                5,
              yi + 20
            )
          );
        }
        */
      }
      // -------------------------------------------
      else if (current - prev !== 0) {
        // bottom
        ctx.fillText(
          '' + (current - prev),
          xi + ((prev + current) / 2) * prop - 20,
          yi + wall.wall_height * prop - 10
        );
      }

      if (index === delimitations.length - 1) {
        const last = Number.parseFloat(wall.wall_width);
        if (last - current !== 0) {
          ctx.fillText(
            '' + (last - current),
            xi + ((last + current) / 2) * prop - 20,
            yi + wall.wall_height * prop - 10
          );
        }
      }

      ctx.closePath();
    });
  }

  private drawWallLetters(
    ctx: CanvasRenderingContext2D,
    wall: any,
    xi: number,
    yi: number,
    prop: number
  ): void {
    let x = xi,
      y = yi;

    // area

    (x = xi), (y = yi);

    ctx.beginPath();
    ctx.font = 'bold 30px serif';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';

    ctx.moveTo(x + 0, y + 0);
    x = x + (wall.wall_width * prop) / 2;

    ctx.fillText(
      (wall.wall_area / 1000000).toFixed(2) + ' m^2',
      x - 50,
      yi - 70
    );
    ctx.stroke();
    ctx.closePath();

    // letters

    (x = xi), (y = yi);

    ctx.beginPath();
    ctx.font = 'bold 28px serif';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';

    const letter1 = wall.wall_identifier.split('-')[0].trim();
    const letter2 = wall.wall_identifier.split('-')[1].trim();

    ctx.moveTo(x + 0, y + 0);
    x = x + wall.wall_width * prop;
    y = y + 0;
    // ctx.lineTo(x, y);

    ctx.moveTo(x + 0, y + 0);
    x = x + 0;
    y = y + wall.wall_height * prop;
    // ctx.lineTo(x, y);
    ctx.fillText(letter2, x - 10, y + 30);

    ctx.moveTo(x + 0, y + 0);
    x = x - wall.wall_width * prop;
    y = y + 0;
    // ctx.lineTo(x, y);
    ctx.fillText(letter1, x - 10, y + 30);

    ctx.moveTo(x + 0, y + 0);
    x = x + 0;
    y = y - wall.wall_height * prop;
    // ctx.lineTo(x, y);

    // ctx.stroke();

    ctx.closePath();

    (x = xi), (y = yi);

    // dimensions

    ctx.beginPath();
    ctx.font = 'bold 24px serif';
    ctx.strokeStyle = '#ff0000';
    ctx.fillStyle = '#ff0000';

    const dim1 = '' + wall.wall_width;
    const dim2 = '' + wall.wall_height;

    ctx.fillText(dim1, x - 30 + (wall.wall_width * prop) / 2, y - 15);
    ctx.moveTo(x + 0, y + 0);
    x = x + wall.wall_width * prop;
    y = y + 0;
    // ctx.lineTo(x, y);

    ctx.fillText(dim2, x + 15, y + (wall.wall_height * prop) / 2);

    ctx.moveTo(x + 0, y + 0);
    x = x + 0;
    y = y + wall.wall_height * prop;
    // ctx.lineTo(x, y);

    ctx.fillText(dim1, x - 30 - (wall.wall_width * prop) / 2, y + 35);

    ctx.moveTo(x + 0, y + 0);
    x = x - wall.wall_width * prop;
    y = y + 0;
    // ctx.lineTo(x, y);

    ctx.fillText(dim2, x - 70, y - (wall.wall_height * prop) / 2);

    ctx.moveTo(x + 0, y + 0);
    x = x + 0;
    y = y - wall.wall_height * prop;
    // ctx.lineTo(x, y);

    // ctx.stroke();

    ctx.closePath();
  }

  // -----------------------------------------------------------------------------------------
}
