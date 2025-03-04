import './index.css';
import { WatchsController } from './watchs-controller';
import { WatchsModel } from './watchs-model';
import { WatchsView } from './watchs-view';



const watchsView : WatchsView = new WatchsView();
const watchsModel : WatchsModel = new WatchsModel();
const watchsController : WatchsController = new WatchsController(watchsModel, watchsView);