import { EditionMode, WatchModel, WatchsModel } from "./watchs-model";
import { v4 as uuidv4 } from 'uuid';
import { WatchsView } from "./watchs-view";

export class WatchsController{
    private watchsModel : WatchsModel;
    private watchsView : WatchsView;

    constructor(watchsModel : WatchsModel, watchsView : WatchsView){
        this.watchsModel = watchsModel;
        this.watchsView = watchsView;
        const nowDate = new Date();

        this.watchsModel.setSeconds(nowDate.getUTCHours()*3600 + nowDate.getUTCMinutes() * 60 + nowDate.getUTCSeconds());
        setInterval(()=>{
            this.watchsModel.addSeconds(1);
        },1000);
        this.watchsView.connectController(this);
        this.watchsModel.getSelectedTimezone().subscribe((timezone : number)=>{
            const watchIds : string []= watchsModel.getWatchIds(); 
            if(watchIds.length >0){  
                watchsModel.getWatchModel(watchIds[watchIds.length-1]).setTimezone(timezone);
            }
        });
    }

    getWatchsModels() : Map<string,WatchModel>{
        return this.watchsModel.getWatchsModels();
    }

    onAddButtonClick() : WatchModel{
        const uuid : string = uuidv4();
        return this.watchsModel.setNewWatch(uuid);
    }

    onModeButtonClick(id:string) {
        const watchModel : WatchModel=this.watchsModel.getWatchModel(id);
        switch(watchModel.getEditionMode()){
            case EditionMode.None :
                watchModel.setEditionMode(EditionMode.Hours);
                break;
            case EditionMode.Hours :
                watchModel.setEditionMode(EditionMode.Minutes);
                break;
            case EditionMode.Minutes :
                watchModel.setEditionMode(EditionMode.None);
                break;
            default:
                console.log("ERROR, THE EDITION MODE LOOKS SUSPICIOUS");
        }
    }

    onIncreaseButtonClick(id:string){
        const watchModel : WatchModel = this.watchsModel.getWatchModel(id);
        switch(watchModel.getEditionMode()){
            case EditionMode.None :
                break;
            case EditionMode.Hours :
                watchModel.addSeconds(3600);
                break;
            case EditionMode.Minutes :
                watchModel.addSeconds(60);;
                break;
            default:
                console.log("ERROR, THE EDITION MODE LOOKS SUSPICIOUS");
        }
    }

    onResetButtonClick(id:string){
        this.watchsModel.getWatchModel(id).resetLocalSeconds();
    }

    onSwitchDisplayButtonClick(id:string){
        this.watchsModel.getWatchModel(id).switchDisplayMode();
    }

    onTimezoneSelectedChanged(timezone : number){
        this.watchsModel.setSelectedTimezone(timezone);
    }

    onDeleteButtonClick(id:string){
        this.watchsModel.deleteWatch(id);
    }

}