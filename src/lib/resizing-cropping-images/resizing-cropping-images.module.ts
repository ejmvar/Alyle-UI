import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from 'alyle-ui/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { LyResizingCroppingImages } from './resizing-cropping-images';

@NgModule({
  imports: [CommonModule, FormsModule, ThemeModule],
  exports: [LyResizingCroppingImages],
  declarations: [LyResizingCroppingImages]
})
export class LyResizingCroppingImageModule {}