import { BehaviorSubject, Observable } from "rxjs";

export enum  EditionMode{
    None,
    Hours,
    Minutes
}

export class WatchModel{
    id : string;
    private editionModeBehaviourSubject: BehaviorSubject<EditionMode>;
    private localSecondsBehaviourSubject : BehaviorSubject<number>;
    private globalSecondsBehaviourSubject : BehaviorSubject<number>;

    constructor(id : string, globalSecondsBehaviourSubject : BehaviorSubject<number>){
        this.id =  id;
        this.globalSecondsBehaviourSubject = globalSecondsBehaviourSubject;
        this.editionModeBehaviourSubject = new BehaviorSubject<EditionMode>(EditionMode.None);
        this.localSecondsBehaviourSubject = new BehaviorSubject<number>(0);
    }

    addSeconds(seconds : number){
        this.localSecondsBehaviourSubject.next(this.localSecondsBehaviourSubject.getValue() + seconds);
    }

    setEditionMode(editionMode : EditionMode){
        this.editionModeBehaviourSubject.next(editionMode);
    }

    getEditionMode(){
        return this.editionModeBehaviourSubject.getValue();
    }

    getGlobalSeconds():BehaviorSubject<number>{
        return this.globalSecondsBehaviourSubject;
    }

    getLocalSeconds():BehaviorSubject<number>{
        return this.localSecondsBehaviourSubject;
    }

    resetLocalSeconds(){
        this.localSecondsBehaviourSubject.next(0);
    }


}



export class WatchsModel{

    private globalSecondsBehaviourSubject : BehaviorSubject<number>;
    private watchsModelMap : Map<string,WatchModel>;
    constructor(){
        this.watchsModelMap = new Map<string,WatchModel>
        this.globalSecondsBehaviourSubject = new BehaviorSubject<number>(0);
    }

    setNewWatch(id : string): WatchModel{
        const watchModel : WatchModel = new WatchModel(id,this.globalSecondsBehaviourSubject);
        this.watchsModelMap.set(id,watchModel);
        return watchModel;
    }

    getWatchModel(id:string): WatchModel{
        return this.watchsModelMap.get(id);
    }

    addSeconds(seconds : number){
        this.globalSecondsBehaviourSubject.next(this.globalSecondsBehaviourSubject.getValue()+seconds);
    }

    setSeconds(seconds:number){
        this.globalSecondsBehaviourSubject.next(seconds);
    }

    getWatchsModels():Map<string,WatchModel> {
        return this.watchsModelMap;
    }

    


}