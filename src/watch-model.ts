import { BehaviorSubject, Observable } from "rxjs";

export class WatchModel{

    private secondsBehaviourSubject : BehaviorSubject<number>;

    constructor(){
        this.secondsBehaviourSubject = new BehaviorSubject<number>(0);
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


}