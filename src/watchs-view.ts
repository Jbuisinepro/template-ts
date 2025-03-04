import { v4 as uuidv4 } from 'uuid';
import { Observable } from "rxjs";
import { WatchsController } from './watchs-controller';
import { EditionMode, WatchModel } from './watchs-model';
import { HtmlTagObject } from 'html-webpack-plugin';

export class WatchsView{

    isSpanVisible : boolean ;

    constructor(){
        this.isSpanVisible = true;
    }


    connectController(watchController : WatchsController){
        document.getElementById("add-button").addEventListener("click",()=>{
           const  watchModel : WatchModel = watchController.onAddButtonClick();
            this.createNewWatch(watchModel.id);
            this.createButtonsListeners(watchController,watchModel.id);
            watchModel.getGlobalSeconds().subscribe((seconds)=>{
                this.updateWatchDigits(watchModel.id, seconds + watchModel.getLocalSeconds().getValue());
            })
            watchModel.getLocalSeconds().subscribe((seconds)=>{
                this.updateWatchDigits(watchModel.id,seconds + watchModel.getGlobalSeconds().getValue());
            })
        });
        setInterval(()=> {
            const watchsIds :  string[]= Array.from(watchController.getWatchsModels().keys());
            this.isSpanVisible = !this.isSpanVisible;
                for(const watchId of watchsIds){
                    this.changeSpanVisibility(watchId,watchController.getWatchsModels().get(watchId).getEditionMode());
                }
            }
        ,1000)
    }

    

    private createNewWatch(id : string){
        const watchContainer : HTMLElement = document.createElement('div');
        watchContainer.classList.add("watch-container");
        const watchDial : HTMLElement = document.createElement('div');
        watchDial.classList.add("watch-dial");

        const modeButton : HTMLElement = document.createElement('button');
        const lightButton : HTMLElement = document.createElement('button');
        const increaseButton : HTMLElement = document.createElement('button');
        const resetButton : HTMLElement = document.createElement('button')

        modeButton.innerText = "M";
        lightButton.innerText ="L";
        increaseButton.innerText = "I";       
        resetButton.innerText = "R";

        modeButton.classList.add("button");
        modeButton.classList.add("mode");

        lightButton.classList.add("button");
        lightButton.classList.add("light");

        increaseButton.classList.add("button");
        increaseButton.classList.add("increase");

        resetButton.classList.add("button");
        resetButton.classList.add("reset");

        const displayScreen : HTMLElement =document.createElement('div');
        displayScreen.classList.add("display-screen");
        displayScreen.classList.add("light-off");

        const hoursDigits : HTMLElement = document.createElement('span');
        const firstDoubleDot : HTMLElement = document.createElement('span');
        const minutesDigits : HTMLElement = document.createElement('span');
        const secondDoubleDot : HTMLElement = document.createElement('span');
        const secondsDigits : HTMLElement = document.createElement('span');

        hoursDigits.textContent = '01';
        firstDoubleDot.textContent=':';
        minutesDigits.textContent='02';
        secondDoubleDot.textContent = ":";
        secondsDigits.textContent='03';


        displayScreen.appendChild(hoursDigits);
        displayScreen.appendChild(firstDoubleDot);
        displayScreen.appendChild(minutesDigits);
        displayScreen.appendChild(secondDoubleDot);
        displayScreen.appendChild(secondsDigits);



        watchDial.appendChild(displayScreen);
        watchDial.appendChild(modeButton);
        watchDial.appendChild(lightButton);
        watchDial.appendChild(increaseButton);
        watchDial.appendChild(resetButton);
        watchContainer.appendChild(watchDial);
        document.body.appendChild(watchContainer);

        modeButton.id = `${id}/mode`;
        lightButton.id= `${id}/light`;
        increaseButton.id =`${id}/increase`;
        resetButton.id = `${id}/reset`;
        displayScreen.id = `${id}/display-screen`;

        hoursDigits.id = `${id}/hours`;
        minutesDigits.id = `${id}/minutes`;
        secondsDigits.id = `${id}/seconds`;
    }

    private changeLightMode(id : string){
        const displayScreenElement : HTMLElement = document.getElementById(`${id}/display-screen`);
        if(displayScreenElement.classList.contains("light-on")){
            displayScreenElement.classList.remove("light-on");
            displayScreenElement.classList.add("ligh-off");
        }
        else if (displayScreenElement.classList.contains("light-off")){
            displayScreenElement.classList.remove("ligh-off");
            displayScreenElement.classList.add("light-on");
        }

    }

    private createButtonsListeners(watchController : WatchsController,id :string){
        document.getElementById(`${id}/mode`).addEventListener("click", ()=>{
            watchController.onModeButtonClick(id);
        })
        document.getElementById(`${id}/light`).addEventListener("click", ()=>{
            this.changeLightMode(id);
        })
        document.getElementById(`${id}/increase`).addEventListener("click", ()=>{
            watchController.onIncreaseButtonClick(id);
        })
        document.getElementById(`${id}/reset`).addEventListener("click", ()=>{
            watchController.onResetButtonClick(id);
        })
    }

    private updateWatchDigits(watchId : string ,seconds : number){
        document.getElementById(`${watchId}/seconds`).textContent = (seconds%60).toString().padStart(2,'0');
        document.getElementById(`${watchId}/minutes`).textContent = (Math.trunc(seconds/60)%60).toString().padStart(2,'0');
        document.getElementById(`${watchId}/hours`).textContent = (Math.trunc(seconds/3600)%24).toString().padStart(2,'0');
    }

    private changeSpanVisibility(watchId : string,editionMode: EditionMode){
        const hoursDisplayed = document.getElementById(`${watchId}/hours`);
        const minutesDisplayed = document.getElementById(`${watchId}/minutes`);
        switch(editionMode){
            case EditionMode.None:
                hoursDisplayed.style.visibility = "visible";
                minutesDisplayed.style.visibility ="visible"
                break;
            case EditionMode.Hours:
                this.isSpanVisible ? hoursDisplayed.style.visibility ='visible' : hoursDisplayed.style.visibility ='hidden';
                minutesDisplayed.className="digit-span";
                break;
            case EditionMode.Minutes:
                hoursDisplayed.style.visibility = "visible";
                this.isSpanVisible ? minutesDisplayed.style.visibility ="visible" : minutesDisplayed.style.visibility ="hidden";
            break;
        }
    }
}