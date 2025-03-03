import { Observable } from "rxjs";

export class WatchView{
    private secondsDisplayed ;
    private minutesDisplayed : HTMLElement ;
    private hoursDisplayed : HTMLElement ;

    constructor(){
        this.secondsDisplayed = document.getElementById('seconds');
        this.minutesDisplayed = document.getElementById('minutes');
        this.hoursDisplayed = document.getElementById('hours');
    }

    setSecondsObservableSubscription(secondsObersvable : Observable<number>){
        secondsObersvable.subscribe((seconds : number)=>{
            this.secondsDisplayed.textContent = (seconds%60).toString().padStart(2,'0') ;
            this.minutesDisplayed.textContent = (Math.trunc(seconds/60) %60).toString().padStart(2,'0') ;
            this.hoursDisplayed.textContent = (Math.trunc(seconds/3600)%24).toString().padStart(2,'0') ;
        })
    }
}