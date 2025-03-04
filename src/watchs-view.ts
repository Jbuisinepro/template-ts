import { Observable, Subscription } from 'rxjs';
import { WatchsController } from './watchs-controller';
import { DisplayMode, EditionMode, WatchModel } from './watchs-model';

export class WatchsView{

    isSpanVisible : boolean ;
    observableSubscriptions :  Map<string,Subscription[]>;

    constructor(){
        this.isSpanVisible = true;
        this.observableSubscriptions =  new Map<string,Subscription[]>();

    }


    connectController(watchController : WatchsController){
        this.createTimezonOptionsListener(watchController);

        document.getElementById("add-button").addEventListener("click",()=>{
           const  watchModel : WatchModel = watchController.onAddButtonClick();
            this.createNewWatch(watchModel.id);
            this.createButtonsListeners(watchController,watchModel.id);
            const subscriptions : Subscription[] = [];
            subscriptions.push(watchModel.getGlobalSeconds().subscribe((seconds)=>{
                this.updateWatchDigits(watchModel.id, seconds + watchModel.getLocalSeconds().getValue()+watchModel.getTimezone().getValue()*3600,watchModel.getDisplayMode().getValue());
            }));
            subscriptions.push(watchModel.getLocalSeconds().subscribe((seconds)=>{
                this.updateWatchDigits(watchModel.id,seconds + watchModel.getGlobalSeconds().getValue()+ watchModel.getTimezone().getValue()*3600,watchModel.getDisplayMode().getValue());
            }));
            subscriptions.push(watchModel.getDisplayMode().subscribe((displayMode)=>{
                this.updateDisplayModeView(watchModel.id,displayMode);
                this.updateWatchDigits(watchModel.id, watchModel.getGlobalSeconds().getValue() + watchModel.getLocalSeconds().getValue() + watchModel.getTimezone().getValue()*3600,displayMode);
            }));
            subscriptions.push(watchModel.getTimezone().subscribe((timezone)=>{
                this.updateWatchDigits(watchModel.id, watchModel.getGlobalSeconds().getValue() + watchModel.getLocalSeconds().getValue() + timezone * 3600,watchModel.getDisplayMode().getValue());
            }));
            this.observableSubscriptions.set(watchModel.id,subscriptions);
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
        const resetButton : HTMLElement = document.createElement('button');
        const switchButton : HTMLElement = document.createElement('button');
        const deleteButton : HTMLElement = document.createElement('button');


        modeButton.innerText = "M";
        lightButton.innerText ="L";
        increaseButton.innerText = "I";       
        resetButton.innerText = "R";
        switchButton.innerText = "S";
        deleteButton.innerText = "X";
        

        modeButton.classList.add("button");
        modeButton.classList.add("mode");

        lightButton.classList.add("button");
        lightButton.classList.add("light");

        increaseButton.classList.add("button");
        increaseButton.classList.add("increase");

        resetButton.classList.add("button");
        resetButton.classList.add("reset");

        switchButton.classList.add("button");
        switchButton.classList.add("switch-display");

        deleteButton.classList.add('delete-button');

        const displayScreen : HTMLElement =document.createElement('div');
        displayScreen.classList.add("display-screen");
        displayScreen.classList.add("light-off");

        const hoursDigits : HTMLElement = document.createElement('span');
        const firstDoubleDot : HTMLElement = document.createElement('span');
        const minutesDigits : HTMLElement = document.createElement('span');
        const secondDoubleDot : HTMLElement = document.createElement('span');
        const secondsDigits : HTMLElement = document.createElement('span');

        const ampmSpan : HTMLElement = document.createElement('span');

        hoursDigits.textContent = '01';
        firstDoubleDot.textContent=':';
        minutesDigits.textContent='02';
        secondDoubleDot.textContent = ":";
        secondsDigits.textContent='03';
        ampmSpan.textContent="AM";
        ampmSpan.style.visibility ="hidden";


        displayScreen.appendChild(hoursDigits);
        displayScreen.appendChild(firstDoubleDot);
        displayScreen.appendChild(minutesDigits);
        displayScreen.appendChild(secondDoubleDot);
        displayScreen.appendChild(secondsDigits);
        displayScreen.appendChild(ampmSpan);



        watchDial.appendChild(displayScreen);
        watchDial.appendChild(modeButton);
        watchDial.appendChild(lightButton);
        watchDial.appendChild(increaseButton);
        watchDial.appendChild(resetButton);
        watchDial.appendChild(switchButton);

        watchContainer.appendChild(watchDial);
        watchContainer.appendChild(deleteButton);
        document.body.appendChild(watchContainer);

        modeButton.id = `${id}/mode`;
        lightButton.id= `${id}/light`;
        increaseButton.id =`${id}/increase`;
        resetButton.id = `${id}/reset`;
        displayScreen.id = `${id}/display-screen`;
        switchButton.id = `${id}/switch-display`;
        deleteButton.id = `${id}/delete`;

        hoursDigits.id = `${id}/hours`;
        minutesDigits.id = `${id}/minutes`;
        secondsDigits.id = `${id}/seconds`;

        watchContainer.id = `${id}/watch-container`

        ampmSpan.id = `${id}/ampm`;
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
            this.changeSpanVisibility(id, watchController.getWatchsModels().get(id).getEditionMode());

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
        document.getElementById(`${id}/switch-display`).addEventListener("click",()=>{
            watchController.onSwitchDisplayButtonClick(id);
        })
        document.getElementById(`${id}/delete`).addEventListener("click", ()=>{
            watchController.onDeleteButtonClick(id);
            this.unsubscribeAll(id);
            document.getElementById(`${id}/watch-container`).remove();
        })

    }

    private createTimezonOptionsListener(watchController : WatchsController){
        const regex = /UTC([+-]\d+)/;
        const timezoneElement : HTMLElement = document.getElementById("timezone");
        timezoneElement.addEventListener("change",((event)=>{
            const timezone : number = parseInt((event.target as HTMLSelectElement).value.match(regex)[1],10);
            watchController.onTimezoneSelectedChanged(timezone);
        }));
    }

    private updateWatchDigits(watchId : string ,seconds : number, displayMode : DisplayMode){
        const secondsToUse : number = seconds + 24 * 60 *60;
        document.getElementById(`${watchId}/seconds`).textContent = (secondsToUse%60).toString().padStart(2,'0');
        document.getElementById(`${watchId}/minutes`).textContent = (Math.trunc(secondsToUse/60)%60).toString().padStart(2,'0');
        switch(displayMode){
            case DisplayMode.AMPM:
                const classicHour :number = (Math.trunc(secondsToUse/3600)%24);
                if(classicHour>11){
                    document.getElementById(`${watchId}/ampm`).innerText = "PM";
                }
                else{
                    document.getElementById(`${watchId}/ampm`).innerText = "AM";
                }
                document.getElementById(`${watchId}/hours`).textContent = (classicHour%12).toString().padStart(2,'0');
                break;
            case DisplayMode.Classic:
                document.getElementById(`${watchId}/hours`).textContent = (Math.trunc(secondsToUse/3600)%24).toString().padStart(2,'0');
                break;
        }
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

    private updateDisplayModeView(watchId: string, displayMode :DisplayMode){
        const ampmSpan : HTMLElement = document.getElementById(`${watchId}/ampm`)
        switch(displayMode){
            case DisplayMode.AMPM :
                ampmSpan.style.visibility ="visible";
                break;
            case DisplayMode.Classic :
                ampmSpan.style.visibility ="hidden";
                break;
        }
    }

    private unsubscribeAll(watchId : string){
        const subscriptions : Subscription[] = this.observableSubscriptions.get(watchId);
        for(const sub of subscriptions){
            sub.unsubscribe();
        }
        this.observableSubscriptions.delete(watchId);
    }
}