import { Observable } from "rxjs";
import { WatchController } from "./watch-controller";
import { EditionMode } from "./watch-model";

export class WatchView{
    private secondsDisplayed :HTMLElement;
    private minutesDisplayed : HTMLElement ;
    private hoursDisplayed : HTMLElement ;
    private editionMode : EditionMode = EditionMode.None;
    private isSpanVisible : boolean = true;

    constructor(){
        this.secondsDisplayed = document.getElementById('seconds');
        this.minutesDisplayed = document.getElementById('minutes');
        this.hoursDisplayed = document.getElementById('hours');
        setInterval(()=>{
            this.changeSpanVisibility(this.editionMode);
        },1000);

    }

    connectController(watchController : WatchController){
        document.getElementById("mode-button").addEventListener("click", ()=>{ 
            watchController.onModeButtonClick();
        });
        document.getElementById("increase-button").addEventListener("click", ()=>{ 
            watchController.onIncreaseButtonClick();
        });
    }

    setSecondsObservableSubscription(secondsObersvable : Observable<number>){
        secondsObersvable.subscribe((seconds : number)=>{
            this.secondsDisplayed.textContent = (seconds%60).toString().padStart(2,'0') ;
            this.minutesDisplayed.textContent = (Math.trunc(seconds/60) %60).toString().padStart(2,'0') ;
            this.hoursDisplayed.textContent = (Math.trunc(seconds/3600)%24).toString().padStart(2,'0') ;
        })
    }

    setEditionModeObservableSubscription(editionModeObservable : Observable<EditionMode>){
        editionModeObservable.subscribe((editionMode)=> {
            switch(editionMode){
                case EditionMode.None:
                    this.editionMode = editionMode;
                    break;
                case EditionMode.Hours:
                    this.editionMode = editionMode;
                    break;
                case EditionMode.Minutes:
                    this.editionMode = editionMode;
                    break;
            }
        })
    }

    changeSpanVisibility(editionMode: EditionMode){
        switch(editionMode){
            case EditionMode.None:
                this.hoursDisplayed.style.visibility = "visible";
                this.minutesDisplayed.style.visibility ="visible"
                this.isSpanVisible = true;
                break;
            case EditionMode.Hours:
                this.isSpanVisible ? this.hoursDisplayed.style.visibility ='visible' : this.hoursDisplayed.style.visibility ='hidden';
                this.minutesDisplayed.className="digit-span";
                this.isSpanVisible = !this.isSpanVisible;
                break;
            case EditionMode.Minutes:
                this.hoursDisplayed.style.visibility = "visible";
                this.isSpanVisible ? this.minutesDisplayed.style.visibility ="visible" : this.minutesDisplayed.style.visibility ="hidden";
                this.isSpanVisible = ! this.isSpanVisible;
            break;
        }
    }
}