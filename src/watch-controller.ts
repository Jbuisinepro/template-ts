import { WatchModel } from "./watch-model";
import { WatchView } from "./watch-view";

export class WatchController{
    private watchModel : WatchModel;
    private watchView : WatchView;

    constructor(watchModel : WatchModel, watchView : WatchView){
        this.watchModel = watchModel;
        this.watchView = watchView;
        const nowDate = new Date();

        this.watchModel.setSeconds(nowDate.getHours()*3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds());
        setInterval(()=>{
            this.watchModel.addSeconds(1);
        },1000);
        this.watchView.setSecondsObservableSubscription(this.watchModel.getSecondsObservable());
    }

}