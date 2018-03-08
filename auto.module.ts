import { AutoCompleteDirective } from "./auto.directive";
import { AutoCompleteService } from "./auto.service";
import { NgModule } from "@angular/core";
@NgModule({
    declarations: [AutoCompleteDirective],
    exports: [AutoCompleteDirective],
    providers: [AutoCompleteService]
})
export class AutoCompleteModule {
}