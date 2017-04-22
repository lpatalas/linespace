import { AuthenticationService } from '../../security/authenticationService';
import { ObjectFactory } from '../../objectFactory';
import { SessionManager } from '../../security/sessionManager';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import { SideMenuItemComponent } from './sideMenuItem';
import { SimplePopupComponent } from '../popups/simplePopup';

export interface SideMenuProps { executeAction: any }
export interface SideMenuState { isSideMenuCollapsed: boolean, areNewMessagesAvailable: boolean; }

export class SideMenuComponent extends React.Component<SideMenuProps, SideMenuState>{

    private sessionManager: SessionManager;
    private authenticationService: AuthenticationService;

    constructor() {
        super();

        this.state = { isSideMenuCollapsed: false, areNewMessagesAvailable: false };
        this.sessionManager = ObjectFactory.createSessionManager();
        this.authenticationService = new AuthenticationService();
    }


    messages = () => {
        console.log('... display messages ...');
        browserHistory.push('/messages');
        this.props.executeAction();
    }

    logout = () => {
        console.log('... logout ...');
        browserHistory.push('/');
        this.authenticationService.signOut();
    }

    login = () => {
        console.log('... login ...');
        browserHistory.push('/login');
        this.props.executeAction();
    }

    reports = () => {
        console.log('... display reports ...');
        this.props.executeAction();
    }

    toggleSinglePopup = () => {
        let newState = Object.assign({}, this.state, { areNewMessagesAvailable: !this.state.areNewMessagesAvailable });
        this.setState(newState);
    }

    render() {
        let menuItems: JSX.Element[] = [];

        if (this.state.areNewMessagesAvailable)
            menuItems.push(<SideMenuItemComponent key="1" action={this.messages} title="Messages" icon="fa fa-envelope-open fa-2x" isSideMenuCollapsed={this.state.isSideMenuCollapsed} />);
        else
            menuItems.push(<SideMenuItemComponent key="1" action={this.messages} title="Messages" icon="fa fa-envelope fa-2x" isSideMenuCollapsed={this.state.isSideMenuCollapsed} />);


        menuItems.push(<SideMenuItemComponent key="2" action={this.reports} title="Reports" icon="fa fa-book fa-2x" isSideMenuCollapsed={this.state.isSideMenuCollapsed} />);
        if (this.sessionManager.isUserLogged)
            menuItems.push(<SideMenuItemComponent key="4" action={this.logout} title="Logout" icon="fa fa-sign-out fa-2x" isSideMenuCollapsed={this.state.isSideMenuCollapsed} />);
        else
            menuItems.push(<SideMenuItemComponent key="3" action={this.login} title="Login" icon="fa fa-sign-in fa-2x" isSideMenuCollapsed={this.state.isSideMenuCollapsed} />);


        return (
            <aside className={"aside-menu" + (this.state.isSideMenuCollapsed ? "" : " aside-menu--extended")}>
                <p>{this.state.isSideMenuCollapsed}</p>
                <ul>
                    {menuItems}
                </ul>
                <a href="#" onClick={this.toggleSinglePopup}>single popup</a>
                {
                    this.state.areNewMessagesAvailable ? <SimplePopupComponent closePopup={this.toggleSinglePopup} header="header" isDialog={false} /> : null
                }
                {
                    this.state.isSideMenuCollapsed ?
                        <a className="aside-menu__extender" href="#" onClick={this.toggleSideMenu}><i className="fa fa-angle-double-right fa-2x" aria-hidden="true"></i></a> :
                        <a className="aside-menu__extender" href="#" onClick={this.toggleSideMenu}><i className="fa fa-angle-double-left fa-2x" aria-hidden="true"></i></a>
                }
            </aside>
        );
    }

    private toggleSideMenu = () => {
        let newState = Object.assign({}, this.state, { isSideMenuCollapsed: !this.state.isSideMenuCollapsed });
        this.setState(newState);
    }

    // private togglePopup = () => {
    //     const newState = Object.assign({}, this.state, { isPopupVisible: !this.state.isPopupVisible });
    //     this.setState(newState);
    // }
}
