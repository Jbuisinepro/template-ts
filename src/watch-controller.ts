import { EditionMode, WatchModel } from "./watch-model";
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
        this.watchView.setEditionModeObservableSubscription(this.watchModel.getEditionModeObservable());
        this.watchView.connectController(this);
    }

    onModeButtonClick(){
        switch(this.watchModel.getEditionMode()){
            case  EditionMode.None :
                this.watchModel.setEditionMode(EditionMode.Hours);
                break;
            case EditionMode.Hours:
                this.watchModel.setEditionMode(EditionMode.Minutes);
                break;
            case EditionMode.Minutes:
                this.watchModel.setEditionMode(EditionMode.None);
                break;
            default:
                console.log("ERROR, THE EDITION MODE LOOKS SUSPICIOUS");
        }
    }

    onIncreaseButtonClick(){
        switch(this.watchModel.getEditionMode()){
            case EditionMode.Hours:
                this.watchModel.addSeconds(3600);
                break;
            case EditionMode.Minutes:
                this.watchModel.addSeconds(60);
                break;
        }

    }

}