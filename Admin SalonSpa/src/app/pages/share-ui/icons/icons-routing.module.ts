import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { RemixComponent } from "./remix/remix.component";
import { BoxiconsComponent } from "./boxicons/boxicons.component";
import { MaterialdesignComponent } from "./materialdesign/materialdesign.component";
import { FeatherComponent } from "./feather/feather.component";
import { LineawesomeComponent } from "./lineawesome/lineawesome.component";
import { IconsCryptoComponent } from "./icons-crypto/icons-crypto.component";

const routes: Routes = [
  {
    path: 'remix',
    component: RemixComponent
  },
  {
    path: 'boxicons',
    component: BoxiconsComponent
  },
  {
    path: 'materialdesign',
    component: MaterialdesignComponent
  },
  {
    path: 'feather',
    component: FeatherComponent
  },
  {
    path: 'lineawesome',
    component: LineawesomeComponent
  },
  {
    path:"icons-crypto",
    component:IconsCryptoComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IconsRoutingModule {}
