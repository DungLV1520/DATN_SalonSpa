import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Component pages
import { ScrollbarComponent } from "./scrollbar/scrollbar.component";
import { AnimationComponent } from "./animation/animation.component";
import { TourComponent } from "./tour/tour.component";
import { RatingsComponent } from "./ratings/ratings.component";
import { HighlightComponent } from "./highlight/highlight.component";
import { ScrollspyComponent } from "./scrollspy/scrollspy.component";

const routes: Routes = [
  {
    path: "scrollbar",
    component: ScrollbarComponent,
  },
  {
    path: "animation",
    component: AnimationComponent,
  },
  {
    path: "tour",
    component: TourComponent,
  },
  {
    path: "ratings",
    component: RatingsComponent,
  },
  {
    path: "highlight",
    component: HighlightComponent,
  },
  {
    path: "scrollspy",
    component: ScrollspyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsvanceUiRoutingModule {}
