import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  imports: [
    CommonModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          /**
           * Defines the horizontal position on the screen
           * 'left' | 'middle' | 'right'
           */
          position: 'right',
          /**
           * Defines the horizontal distance to the screen edge (in px)
           */
          distance: 12,
        },
        vertical: {
          /**
           * Defines the vertical position on the screen
           * 'top' | 'bottom'
           */
          position: 'bottom',
          /**
           * Defines the vertical distance to the screen edge (in px)
           */
          distance: 70,
          /**
           * Defines the vertical gap, existing between multiple notifications (in px)
           */
          gap: 10,
        },
      },
      /**
       * Defines the notification theme, responsible for the Visual Design of notifications
       */
      theme: 'material',
      behaviour: {
        /**
         * Defines whether each notification will hide itself automatically after a timeout passes
         * number | false
         */
        autoHide: 5000,

        /**
         * Defines what happens when someone clicks on a notification
         * 'hide' | false
         */
        onClick: false,

        /**
         * Defines what happens when someone hovers over a notification
         * 'pauseAutoHide' | 'resetAutoHide' | false
         */
        onMouseover: 'pauseAutoHide',

        /**
         * Defines whether the dismiss button is visible or not
         * boolean
         */
        showDismissButton: true,

        /**
         * Defines whether multiple notification will be stacked, and how high the stack limit is
         * number | false
         */
        stacking: 10,
      },
      animations: {
        /**
         * Defines whether all (!) animations are enabled or disabled
         */
        enabled: true,

        show: {
          /**
           * Defines the animation preset that will be used to animate a new notification in
           * 'fade' | 'slide'
           */
          preset: 'fade',

          /**
           * Defines how long it will take to animate a new notification in (in ms)
           */
          speed: 300,

          /**
           * Defines which easing method will be used when animating a new notification in
           * 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
           */
          easing: 'ease',
        },

        hide: {
          /**
           * Defines the animation preset that will be used to animate a new notification out
           * 'fade' | 'slide'
           */
          preset: 'fade',

          /**
           * Defines how long it will take to animate a new notification out (in ms)
           * number
           */
          speed: 300,

          /**
           * Defines which easing method will be used when animating a new notification out
           * 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
           */
          easing: 'ease',

          /**
           * Defines the animation offset used when hiding multiple notifications at once (in ms)
           * number | false
           */
          offset: 50,
        },

        shift: {
          /**
           * Defines how long it will take to shift a notification around (in ms)
           */
          speed: 300,

          /**
           * Defines which easing method will be used when shifting a notification around
           */
          easing: 'ease', // All standard CSS easing methods work
        },

        /**
         * Defines the overall animation overlap, allowing for much smoother looking animations (in ms)
         * number | false
         */
        overlap: 150,
      },
    }),
  ],
  exports: [NotifierModule],
})
export class AppNotifierConfigModule {}
