import { BehaviorSubject, Observable } from "rxjs";

export enum  EditionMode{
    None,
    Hours,
    Minutes
}

export class WatchModel{

    private secondsBehaviourSubject : BehaviorSubject<number>;
    private editionModeBehaviourSubject: BehaviorSubject<EditionMode>;

    constructor(){
        this.secondsBehaviourSubject = new BehaviorSubject<number>(0);
        this.editionModeBehaviourSubject = new BehaviorSubject<EditionMode>(EditionMode.None);
    }

    setSeconds(seconds : number){
        this.secondsBehaviourSubject.next(seconds);
    }

    addSeconds(seconds : number){
        this.secondsBehaviourSubject.next(this.secondsBehaviourSubject.getValue()+seconds);
    }

    getSecondsObservable() : Observable<number>{
        return this.secondsBehaviourSubject;
    }

    getEditionModeObservable() :Observable<EditionMode>{
        return this.editionModeBehaviourSubject;
    }

    setEditionMode(editionMode : EditionMode){
        this.editionModeBehaviourSubject.next(editionMode);
    }

    getEditionMode():EditionMode{
        return this.editionModeBehaviourSubject.getValue();
    }


}