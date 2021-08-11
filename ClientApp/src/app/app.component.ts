import { Component, OnInit, AfterViewChecked } from "@angular/core";
import * as api from "@amc-technology/davinci-api";
import {
  IRequest,
  IResponse,
  isResponse,
} from "@amc-technology/davinci-api/dist/HelperFunctions";
import bind from 'bind-decorator';
interface IPayload {
  pluginName: string;
  message: IRequest | IResponse;
  didTimeout?: boolean;
}
@Component({
  selector: "int-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = "SampleInt";

  operationsEnabled: boolean[] = [];

  opStrings: string[] = [];

  currentSelectedOperation: number;

  interceptorTimeoutLimit: number = 5000;

  isVisible = true;
  config: api.IAppConfiguration;

  shouldLogEvents = false;

  constructor() {
    // Construct operationsEnabled map, mapping an OPERATIONS number to a boolean,
    // and construct array of OPERATIONS strings indexable by OPERATIONS number.
    // Simply for convenience when using TS enum types.
    Object.keys(api.OPERATIONS)
      .filter(
        (elem) => !isNaN(parseInt(elem)) // Only take keys which are numbers, not strings (TS maps go both ways and contain both keys and values as JS object keys)
      )
      .map(
        (elem) => parseInt(elem) // Turn this list into integers
      )
      .forEach((elem) => {
        this.operationsEnabled.push(false); // initialize operationsEnabled list (May be configurable)
        this.opStrings.push(api.OPERATIONS[elem]); // build opStrings list
      });

    this.currentSelectedOperation = 0; // Set current selected operation to first option (May be configurable)

  }

  async ngOnInit() {
    api.registerOperationInterceptor(
      this.opStrings.map((op, index) => index),
      this.interceptHandler,
      this.interceptorTimeoutLimit,
      api.INTERCEPTOR_TIMEOUT_ACTION.PROCEED_WITH_ORIGINAL // Set to CANCEL to prohibit DaVinci from sending event
    );

    api.setAppHeight(this.isVisible ? 175 : 0);

    console.log(this.opStrings);

    await api.initializeComplete().then((configReturn) => {
      this.config = configReturn;
    });
  }

  toggleLogging() {
  this.shouldLogEvents = !this.shouldLogEvents;
  }

  toggleAll(enabled: boolean) {
    for (let i = 0; i < this.operationsEnabled.length; i++) {
      this.operationsEnabled[i] = enabled;
    }
  }

  /**
   * Used for dynamically setting color of OPERATION options in UI, indicating
   * if capturing that OPERATION is enabled or not.
   *
   * @param op Numeric OPERATIONS value to check
   * @returns 'lightgreen' if capturing OPERATION[op] is enabled, 'unset' otherwise
   */
  getOptionColor(op: number) {
    return this.operationsEnabled[op] ? "lightgreen" : "unset";
  }

  /**
   * Main intercept handling function. Consists of a switch case that
   * decides which specific OPERATION handler to call.
   *
   * @param payload associated data of event being intercepted
   * @returns Returns the modified payload
   */
  @bind
  async interceptHandler(payload: IPayload): Promise<IPayload> {
    try {
      let op: api.OPERATIONS;

      if (payload.didTimeout) {
        throw new Error("Timed out!!"); // Payload timed out
      }

      // Get op depending on if the payload is a request, or a response to a request
      if (isResponse(payload.message)) {
        op = payload.message.request.operation;
      } else {
        op = payload.message.operation;
      }

      if (this.isVisible && this.shouldLogEvents) {
        console.log(`caught op: ${op} = ${api.OPERATIONS[op]}`);
      }

      switch (op) {
        case api.OPERATIONS.ADD_CONTEXTUAL_ACCESS_LIST:
          payload = this.handleAddContextualAccessList(payload);
          break;
        case api.OPERATIONS.ADD_PLUGIN_IMAGE:
          payload = this.handleAddPluginImage(payload);
          break;
        case api.OPERATIONS.GET_BROWSER_NAME:
          payload = this.handleGetBrowserName(payload);
          break;
        case api.OPERATIONS.GET_CALL_CENTER_SETTINGS:
          payload = this.handleGetCallCenterSettings(payload);
          break;
        case api.OPERATIONS.GET_CSS:
          payload = this.handleGetCss(payload);
          break;
        case api.OPERATIONS.GET_LOGGED_IN:
          payload = this.handleGetLoggedIn(payload);
          break;
        case api.OPERATIONS.GET_PAGE_INFO:
          payload = this.handleGetPageInfo(payload);
          break;
        case api.OPERATIONS.GET_PARAMS:
          payload = this.handleGetParams(payload);
          break;
        case api.OPERATIONS.GET_PRESENCE:
          payload = this.handleGetPresence(payload);
          break;
        case api.OPERATIONS.GET_SEARCH_LAYOUT:
          payload = this.handleGetSearchLayout(payload);
          break;
        case api.OPERATIONS.GLOBAL_SEARCH:
          payload = this.handleGlobalSearch(payload);
          break;
        case api.OPERATIONS.GLOBAL_SEARCH_AND_SCREENPOP:
          payload = this.handleGlobalSearchAndScreenpop(payload);
          break;
        case api.OPERATIONS.CHANGE_ICON:
          payload = this.handleChangeIcon(payload);
          break;
        case api.OPERATIONS.INITIALIZE_COMPLETE:
          payload = this.handleInitializeComplete(payload);
          break;
        case api.OPERATIONS.INTERACTION:
          payload = this.handleInteraction(payload);
          break;
        case api.OPERATIONS.IS_PLUGIN_VISIBLE:
          payload = this.handleIsPluginVisible(payload);
          break;
        case api.OPERATIONS.IS_TOOLBAR_VISIBLE:
          payload = this.handleIsToolbarVisible(payload);
          break;
        case api.OPERATIONS.LOAD_SCRIPT:
          payload = this.handleLoadScript(payload);
          break;
        case api.OPERATIONS.LOGIN:
          payload = this.handleLogin(payload);
          break;
        case api.OPERATIONS.LOGOUT:
          payload = this.handleLogout(payload);
          break;
        case api.OPERATIONS.ON_FOCUS:
          payload = this.handleOnFocus(payload);
          break;
        case api.OPERATIONS.ON_PRESENCE_CHANGED:
          payload = this.handleOnPresenceChanged(payload);
          break;
        case api.OPERATIONS.SAVE_ACTIVITY:
          payload = this.handleSaveActivity(payload);
          break;
        case api.OPERATIONS.CHANGE_TITLE:
          payload = this.handleChangeTitle(payload);
          break;
        case api.OPERATIONS.SCREENPOP_CONTROL_CHANGED:
          payload = this.handleScreenpopControlChanged(payload);
          break;
        case api.OPERATIONS.SCREEN_POP:
          payload = this.handleScreenPop(payload);
          break;
        case api.OPERATIONS.SEARCH:
          payload = this.handleSearch(payload);
          break;
        case api.OPERATIONS.SET_PLUGIN_VISIBLE:
          payload = this.handleSetPluginVisible(payload);
          break;
        case api.OPERATIONS.SET_PRESENCE:
          payload = this.handleSetPresence(payload);
          break;
        case api.OPERATIONS.SET_SOFTPHONE_HEIGHT:
          payload = this.handleSetSoftphoneHeight(payload);
          break;
        case api.OPERATIONS.SET_SOFTPHONE_WIDTH:
          payload = this.handleSetSoftphoneWidth(payload);
          break;
        case api.OPERATIONS.SET_TOOLBAR_ENABLED:
          payload = this.handleSetToolbarEnabled(payload);
          break;
        case api.OPERATIONS.SET_TOOLBAR_VISIBLE:
          payload = this.handleSetToolbarVisible(payload);
          break;
        case api.OPERATIONS.SHOW_CONTROLS:
          payload = this.handleShowControls(payload);
          break;
        case api.OPERATIONS.CLEAR_CONTEXTUAL_ACCESS_LIST:
          payload = this.handleClearContextualAccessList(payload);
          break;
        case api.OPERATIONS.USER_INFO:
          payload = this.handleUserInfo(payload);
          break;
        case api.OPERATIONS.CONTEXTUAL_OPERATION:
          payload = this.handleContextualOperation(payload);
          break;
        case api.OPERATIONS.GET_USER_DETAILS:
          payload = this.handleGetUserDetails(payload);
          break;
        case api.OPERATIONS.MY_CALLS_TODAY:
          payload = this.handleMyCallsToday(payload);
          break;
        case api.OPERATIONS.GET_CONFIG:
          payload = this.handleGetConfig(payload);
          break;
        case api.OPERATIONS.DIALPAD_NUMBER_CLICKED:
          payload = this.handleDialpadNumberClicked(payload);
          break;
        case api.OPERATIONS.SPEED_DIAL_NUMBER_CLICKED:
          payload = this.handleSpeedDialNumberClicked(payload);
          break;
        case api.OPERATIONS.NOTIFICATION_TO_FRAMEWORK:
          payload = this.handleNotificationToFramework(payload);
          break;
        case api.OPERATIONS.SUPPORTED_CHANNEL:
          payload = this.handleSupportedChannel(payload);
          break;
        case api.OPERATIONS.FRAMEWORK_NOTIFICATIONS:
          payload = this.handleFrameworkNotifications(payload);
          break;
        case api.OPERATIONS.CLICK_TO_DIAL:
          payload = this.handleClickToDial(payload);
          break;
        case api.OPERATIONS.GET_APP_NAME:
          payload = this.handleGetAppName(payload);
          break;
        case api.OPERATIONS.INTERCEPT:
          payload = this.handleIntercept(payload);
          break;
        case api.OPERATIONS.CONTEXTUAL_EVENT:
          payload = this.handleContextualEvent(payload);
          break;
        case api.OPERATIONS.DEREGISTER:
          payload = this.handleDeregister(payload);
          break;
        case api.OPERATIONS.DISPLAY_IFRAME:
          payload = this.handleDisplayIframe(payload);
          break;
        case api.OPERATIONS.ENABLE_CLICK_TO_DIAL:
          payload = this.handleEnableClickToDial(payload);
          break;
        default:
          console.log(payload);
      }

      return payload;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
/**
 * data[0], contacts: IContextualContact[]
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleAddContextualAccessList(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.ADD_CONTEXTUAL_ACCESS_LIST]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleAddPluginImage(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.ADD_PLUGIN_IMAGE]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleGetBrowserName(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_BROWSER_NAME]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleGetCallCenterSettings(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_CALL_CENTER_SETTINGS]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleGetCss(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_CSS]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleGetLoggedIn(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_LOGGED_IN]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleGetPageInfo(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_PAGE_INFO]) {

    }
    return payload;
}
/**
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleGetParams(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_PARAMS]) {

    }
    return payload;
}
handleGetPresence(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_PRESENCE]) {

    }
    return payload;
}
handleGetSearchLayout(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_SEARCH_LAYOUT]) {

    }
    return payload;
}
handleGlobalSearch(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GLOBAL_SEARCH]) {

    }
    return payload;
}
handleGlobalSearchAndScreenpop(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GLOBAL_SEARCH_AND_SCREENPOP]) {

    }
    return payload;
}
handleChangeIcon(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.CHANGE_ICON]) {

    }
    return payload;
}
handleInitializeComplete(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.INITIALIZE_COMPLETE]) {

    }
    return payload;
}
handleInteraction(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.INTERACTION]) {
      console.log("Got interaction event");
      console.log(data);
    }
    return payload;
}
handleIsPluginVisible(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.IS_PLUGIN_VISIBLE]) {

    }
    return payload;
}
handleIsToolbarVisible(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.IS_TOOLBAR_VISIBLE]) {

    }
    return payload;
}
handleLoadScript(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.LOAD_SCRIPT]) {

    }
    return payload;
}
handleLogin(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.LOGIN]) {

    }
    return payload;
}
handleLogout(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.LOGOUT]) {

    }
    return payload;
}
handleOnFocus(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.ON_FOCUS]) {

    }
    return payload;
}
handleOnPresenceChanged(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.ON_PRESENCE_CHANGED]) {

    }
    return payload;
}
handleSaveActivity(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SAVE_ACTIVITY]) {

    }
    return payload;
}
handleChangeTitle(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.CHANGE_TITLE]) {

    }
    return payload;
}
handleScreenpopControlChanged(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SCREENPOP_CONTROL_CHANGED]) {

    }
    return payload;
}
handleScreenPop(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SCREEN_POP]) {

    }
    return payload;
}
handleSearch(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SEARCH]) {

    }
    return payload;
}
handleSetPluginVisible(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SET_PLUGIN_VISIBLE]) {

    }
    return payload;
}
handleSetPresence(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SET_PRESENCE]) {

    }
    return payload;
}
handleSetSoftphoneHeight(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SET_SOFTPHONE_HEIGHT]) {

    }
    return payload;
}
handleSetSoftphoneWidth(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SET_SOFTPHONE_WIDTH]) {

    }
    return payload;
}
handleSetToolbarEnabled(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SET_TOOLBAR_ENABLED]) {

    }
    return payload;
}
handleSetToolbarVisible(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SET_TOOLBAR_VISIBLE]) {

    }
    return payload;
}
handleShowControls(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SHOW_CONTROLS]) {

    }
    return payload;
}
handleClearContextualAccessList(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.CLEAR_CONTEXTUAL_ACCESS_LIST]) {

    }
    return payload;
}
handleUserInfo(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.USER_INFO]) {

    }
    return payload;
}
handleContextualOperation(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.CONTEXTUAL_OPERATION]) {
      console.log("Got Contextual Operation");
      console.log(data);
    }
    return payload;
}
handleGetUserDetails(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_USER_DETAILS]) {

    }
    return payload;
}
handleMyCallsToday(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.MY_CALLS_TODAY]) {

    }
    return payload;
}
handleGetConfig(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_CONFIG]) {

    }
    return payload;
}
handleDialpadNumberClicked(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.DIALPAD_NUMBER_CLICKED]) {

    }
    return payload;
}
handleSpeedDialNumberClicked(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SPEED_DIAL_NUMBER_CLICKED]) {

    }
    return payload;
}
handleNotificationToFramework(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.NOTIFICATION_TO_FRAMEWORK]) {

    }
    return payload;
}
handleSupportedChannel(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.SUPPORTED_CHANNEL]) {

    }
    return payload;
}
handleFrameworkNotifications(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.FRAMEWORK_NOTIFICATIONS]) {

    }
    return payload;
}

/**
 * data[0], phoneNumber: string
 * data[1], records: SearchRecords
 * data[2], channelType: CHANNEL_TYPES
 *
 * @param payload Intercepted event data
 * @returns Returns modified payload
 */
handleClickToDial(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.CLICK_TO_DIAL]) {
      console.log(data);
      console.log(`Got a click to dial event for phone number: ${data[0]}`)
    }
    return payload;
}
handleGetAppName(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.GET_APP_NAME]) {

    }
    return payload;
}
handleIntercept(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.INTERCEPT]) {

    }
    return payload;
}
handleContextualEvent(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.CONTEXTUAL_EVENT]) {
      console.log("Got contextual event");
      console.log(data);
    }
    return payload;
}
handleDeregister(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.DEREGISTER]) {

    }
    return payload;
}
handleDisplayIframe(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.DISPLAY_IFRAME]) {

    }
    return payload;
}
handleEnableClickToDial(payload: IPayload): IPayload {
    let data = isResponse(payload.message) ? payload.message.request.data : payload.message.data;
    if (this.operationsEnabled[api.OPERATIONS.ENABLE_CLICK_TO_DIAL]) {

    }
    return payload;
}

  ngAfterViewChecked() {
    // setAppHeight(200);
  }

  log(event: any) {
    console.log(event);
  }
}
