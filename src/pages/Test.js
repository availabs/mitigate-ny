import React, { Component } from 'react';


class Test extends Component {
  render () {
    return (
      <div className="all-wrapper solid-bg-all">
        <div className="search-with-suggestions-w">
          <div className="search-with-suggestions-modal">
            <div className="element-search">
              <input className="search-suggest-input" placeholder="Start typing to search..." type="text" />
              <div className="close-search-suggestions"><i className="os-icon os-icon-x" /></div>
            </div>
            <div className="search-suggestions-group">
              <div className="ssg-header">
                <div className="ssg-icon">
                  <div className="os-icon os-icon-box" />
                </div>
                <div className="ssg-name">Projects</div>
                <div className="ssg-info">24 Total</div>
              </div>
              <div className="ssg-content">
                <div className="ssg-items ssg-items-boxed">
                  <a className="ssg-item" href="users_profile_big.html">
                    <div className="item-media" style={{backgroundImage: 'url(img/company6.png)'}} />
                    <div className="item-name">Integ<span>ration</span> with API</div>
                  </a>
                  <a className="ssg-item" href="users_profile_big.html">
                    <div className="item-media" style={{backgroundImage: 'url(img/company7.png)'}} />
                    <div className="item-name">Deve<span>lopm</span>ent Project</div>
                  </a>
                </div>
              </div>
            </div>
            <div className="search-suggestions-group">
              <div className="ssg-header">
                <div className="ssg-icon">
                  <div className="os-icon os-icon-users" />
                </div>
                <div className="ssg-name">Customers</div>
                <div className="ssg-info">12 Total</div>
              </div>
              <div className="ssg-content">
                <div className="ssg-items ssg-items-list">
                  <a className="ssg-item" href="users_profile_big.html">
                    <div className="item-media" style={{backgroundImage: 'url(img/avatar1.jpg)'}} />
                    <div className="item-name">John Ma<span>yer</span>s</div>
                  </a>
                  <a className="ssg-item" href="users_profile_big.html">
                    <div className="item-media" style={{backgroundImage: 'url(img/avatar2.jpg)'}} />
                    <div className="item-name">Th<span>omas</span> Mullier</div>
                  </a>
                  <a className="ssg-item" href="users_profile_big.html">
                    <div className="item-media" style={{backgroundImage: 'url(img/avatar3.jpg)'}} />
                    <div className="item-name">Kim C<span>olli</span>ns</div>
                  </a>
                </div>
              </div>
            </div>
            <div className="search-suggestions-group">
              <div className="ssg-header">
                <div className="ssg-icon">
                  <div className="os-icon os-icon-folder" />
                </div>
                <div className="ssg-name">Files</div>
                <div className="ssg-info">17 Total</div>
              </div>
              <div className="ssg-content">
                <div className="ssg-items ssg-items-blocks">
                  <a className="ssg-item" href="#">
                    <div className="item-icon"><i className="os-icon os-icon-file-text" /></div>
                    <div className="item-name">Work<span>Not</span>e.txt</div>
                  </a>
                  <a className="ssg-item" href="#">
                    <div className="item-icon"><i className="os-icon os-icon-film" /></div>
                    <div className="item-name">V<span>ideo</span>.avi</div>
                  </a>
                  <a className="ssg-item" href="#">
                    <div className="item-icon"><i className="os-icon os-icon-database" /></div>
                    <div className="item-name">User<span>Tabl</span>e.sql</div>
                  </a>
                  <a className="ssg-item" href="#">
                    <div className="item-icon"><i className="os-icon os-icon-image" /></div>
                    <div className="item-name">wed<span>din</span>g.jpg</div>
                  </a>
                </div>
                <div className="ssg-nothing-found">
                  <div className="icon-w"><i className="os-icon os-icon-eye-off" /></div><span>No files were found. Try changing your query...</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="layout-w">
          {/*------------------
START - Mobile Menu
------------------*/}
          <div className="menu-mobile menu-activated-on-click color-scheme-dark">
            <div className="mm-logo-buttons-w">
              <a className="mm-logo" href="index.html"><img src="img/logo.png" /><span>Clean Admin</span></a>
              <div className="mm-buttons">
                <div className="content-panel-open">
                  <div className="os-icon os-icon-grid-circles" />
                </div>
                <div className="mobile-menu-trigger">
                  <div className="os-icon os-icon-hamburger-menu-1" />
                </div>
              </div>
            </div>
            <div className="menu-and-user">
              <div className="logged-user-w">
                <div className="avatar-w"><img alt src="img/avatar1.jpg" /></div>
                <div className="logged-user-info-w">
                  <div className="logged-user-name">Maria Gomez</div>
                  <div className="logged-user-role">Administrator</div>
                </div>
              </div>
              {/*------------------
START - Mobile Menu List
------------------*/}
              <ul className="main-menu">
                <li className="has-sub-menu">
                  <a href="index.html">
                    <div className="icon-w">
                      <div className="os-icon os-icon-layout" />
                    </div><span>Dashboard</span></a>
                  <ul className="sub-menu">
                    <li><a href="index.html">Dashboard 1</a></li>
                    <li><a href="apps_crypto.html">Crypto Dashboard <strong className="badge badge-danger">Hot</strong></a></li>
                    <li><a href="apps_support_dashboard.html">Dashboard 3</a></li>
                    <li><a href="apps_projects.html">Dashboard 4</a></li>
                    <li><a href="apps_bank.html">Dashboard 5</a></li>
                    <li><a href="layouts_menu_top_image.html">Dashboard 6</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="layouts_menu_top_image.html">
                    <div className="icon-w">
                      <div className="os-icon os-icon-layers" />
                    </div><span>Menu Styles</span></a>
                  <ul className="sub-menu">
                    <li><a href="layouts_menu_side_full.html">Side Menu Light</a></li>
                    <li><a href="layouts_menu_side_full_dark.html">Side Menu Dark</a></li>
                    <li><a href="layouts_menu_side_transparent.html">Side Menu Transparent <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="apps_pipeline.html">Side &amp; Top Dark</a></li>
                    <li><a href="apps_projects.html">Side &amp; Top</a></li>
                    <li><a href="layouts_menu_side_mini.html">Mini Side Menu</a></li>
                    <li><a href="layouts_menu_side_mini_dark.html">Mini Menu Dark</a></li>
                    <li><a href="layouts_menu_side_compact.html">Compact Side Menu</a></li>
                    <li><a href="layouts_menu_side_compact_dark.html">Compact Menu Dark</a></li>
                    <li><a href="layouts_menu_right.html">Right Menu</a></li>
                    <li><a href="layouts_menu_top.html">Top Menu Light</a></li>
                    <li><a href="layouts_menu_top_dark.html">Top Menu Dark</a></li>
                    <li><a href="layouts_menu_top_image.html">Top Menu Image <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="layouts_menu_sub_style_flyout.html">Sub Menu Flyout</a></li>
                    <li><a href="layouts_menu_sub_style_flyout_dark.html">Sub Flyout Dark</a></li>
                    <li><a href="layouts_menu_sub_style_flyout_bright.html">Sub Flyout Bright</a></li>
                    <li><a href="layouts_menu_side_compact_click.html">Menu Inside Click</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="apps_bank.html">
                    <div className="icon-w">
                      <div className="os-icon os-icon-package" />
                    </div><span>Applications</span></a>
                  <ul className="sub-menu">
                    <li><a href="apps_email.html">Email Application</a></li>
                    <li><a href="apps_support_dashboard.html">Support Dashboard</a></li>
                    <li><a href="apps_support_index.html">Tickets Index</a></li>
                    <li><a href="apps_crypto.html">Crypto Dashboard <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="apps_projects.html">Projects List</a></li>
                    <li><a href="apps_bank.html">Banking <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="apps_full_chat.html">Chat Application</a></li>
                    <li><a href="apps_todo.html">To Do Application <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="misc_chat.html">Popup Chat</a></li>
                    <li><a href="apps_pipeline.html">CRM Pipeline</a></li>
                    <li><a href="rentals_index_grid.html">Property Listing <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="misc_calendar.html">Calendar</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-file-text" />
                    </div><span>Pages</span></a>
                  <ul className="sub-menu">
                    <li><a href="misc_invoice.html">Invoice</a></li>
                    <li><a href="rentals_index_grid.html">Property Listing <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="misc_charts.html">Charts</a></li>
                    <li><a href="auth_login.html">Login</a></li>
                    <li><a href="auth_register.html">Register</a></li>
                    <li><a href="auth_lock.html">Lock Screen</a></li>
                    <li><a href="misc_pricing_plans.html">Pricing Plans</a></li>
                    <li><a href="misc_error_404.html">Error 404</a></li>
                    <li><a href="misc_error_500.html">Error 500</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-life-buoy" />
                    </div><span>UI Kit</span></a>
                  <ul className="sub-menu">
                    <li><a href="uikit_modals.html">Modals <strong className="badge badge-danger">New</strong></a></li>
                    <li><a href="uikit_alerts.html">Alerts</a></li>
                    <li><a href="uikit_grid.html">Grid</a></li>
                    <li><a href="uikit_progress.html">Progress</a></li>
                    <li><a href="uikit_popovers.html">Popover</a></li>
                    <li><a href="uikit_tooltips.html">Tooltips</a></li>
                    <li><a href="uikit_buttons.html">Buttons</a></li>
                    <li><a href="uikit_dropdowns.html">Dropdowns</a></li>
                    <li><a href="uikit_typography.html">Typography</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-mail" />
                    </div><span>Emails</span></a>
                  <ul className="sub-menu">
                    <li><a href="emails_welcome.html">Welcome Email</a></li>
                    <li><a href="emails_order.html">Order Confirmation</a></li>
                    <li><a href="emails_payment_due.html">Payment Due</a></li>
                    <li><a href="emails_forgot.html">Forgot Password</a></li>
                    <li><a href="emails_activate.html">Activate Account</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-users" />
                    </div><span>Users</span></a>
                  <ul className="sub-menu">
                    <li><a href="users_profile_big.html">Big Profile</a></li>
                    <li><a href="users_profile_small.html">Compact Profile</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-edit-32" />
                    </div><span>Forms</span></a>
                  <ul className="sub-menu">
                    <li><a href="forms_regular.html">Regular Forms</a></li>
                    <li><a href="forms_validation.html">Form Validation</a></li>
                    <li><a href="forms_wizard.html">Form Wizard</a></li>
                    <li><a href="forms_uploads.html">File Uploads</a></li>
                    <li><a href="forms_wisiwig.html">Wisiwig Editor</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-grid" />
                    </div><span>Tables</span></a>
                  <ul className="sub-menu">
                    <li><a href="tables_regular.html">Regular Tables</a></li>
                    <li><a href="tables_datatables.html">Data Tables</a></li>
                    <li><a href="tables_editable.html">Editable Tables</a></li>
                  </ul>
                </li>
                <li className="has-sub-menu">
                  <a href="#">
                    <div className="icon-w">
                      <div className="os-icon os-icon-zap" />
                    </div><span>Icons</span></a>
                  <ul className="sub-menu">
                    <li><a href="icon_fonts_simple_line_icons.html">Simple Line Icons</a></li>
                    <li><a href="icon_fonts_feather.html">Feather Icons</a></li>
                    <li><a href="icon_fonts_themefy.html">Themefy Icons</a></li>
                    <li><a href="icon_fonts_picons_thin.html">Picons Thin</a></li>
                    <li><a href="icon_fonts_dripicons.html">Dripicons</a></li>
                    <li><a href="icon_fonts_eightyshades.html">Eightyshades</a></li>
                    <li><a href="icon_fonts_entypo.html">Entypo</a></li>
                    <li><a href="icon_fonts_font_awesome.html">Font Awesome</a></li>
                    <li><a href="icon_fonts_foundation_icon_font.html">Foundation Icon Font</a></li>
                    <li><a href="icon_fonts_metrize_icons.html">Metrize Icons</a></li>
                    <li><a href="icon_fonts_picons_social.html">Picons Social</a></li>
                    <li><a href="icon_fonts_batch_icons.html">Batch Icons</a></li>
                    <li><a href="icon_fonts_dashicons.html">Dashicons</a></li>
                    <li><a href="icon_fonts_typicons.html">Typicons</a></li>
                    <li><a href="icon_fonts_weather_icons.html">Weather Icons</a></li>
                    <li><a href="icon_fonts_light_admin.html">Light Admin</a></li>
                  </ul>
                </li>
              </ul>
              {/*------------------
END - Mobile Menu List
------------------*/}
              <div className="mobile-menu-magic">
                <h4>Light Admin</h4>
                <p>Clean Bootstrap 4 Template</p>
                <div className="btn-w"><a className="btn btn-white btn-rounded" href="https://themeforest.net/item/light-admin-clean-bootstrap-dashboard-html-template/19760124?ref=Osetin" target="_blank">Purchase Now</a></div>
              </div>
            </div>
          </div>
          {/*------------------
END - Mobile Menu
------------------*/}
          {/*------------------
START - Main Menu
------------------*/}
          <div className="menu-w color-scheme-dark color-style-bright menu-position-top menu-layout-compact sub-menu-style-over sub-menu-color-bright selected-menu-color-light menu-activated-on-hover menu-with-image menu-has-selected-link">
            <div className="logo-w">
              <a className="logo" href="index.html">
                <div className="logo-element" />
                <div className="logo-label">Clean Admin</div>
              </a>
            </div>
            <div className="logged-user-w avatar-inline">
              <div className="logged-user-i">
                <div className="avatar-w"><img alt src="img/avatar1.jpg" /></div>
                <div className="logged-user-info-w">
                  <div className="logged-user-name">Maria Gomez</div>
                  <div className="logged-user-role">Administrator</div>
                </div>
                <div className="logged-user-toggler-arrow">
                  <div className="os-icon os-icon-chevron-down" />
                </div>
                <div className="logged-user-menu color-style-bright">
                  <div className="logged-user-avatar-info">
                    <div className="avatar-w"><img alt src="img/avatar1.jpg" /></div>
                    <div className="logged-user-info-w">
                      <div className="logged-user-name">Maria Gomez</div>
                      <div className="logged-user-role">Administrator</div>
                    </div>
                  </div>
                  <div className="bg-icon"><i className="os-icon os-icon-wallet-loaded" /></div>
                  <ul>
                    <li><a href="apps_email.html"><i className="os-icon os-icon-mail-01" /><span>Incoming Mail</span></a></li>
                    <li><a href="users_profile_big.html"><i className="os-icon os-icon-user-male-circle2" /><span>Profile Details</span></a></li>
                    <li><a href="users_profile_small.html"><i className="os-icon os-icon-coins-4" /><span>Billing Details</span></a></li>
                    <li><a href="#"><i className="os-icon os-icon-others-43" /><span>Notifications</span></a></li>
                    <li><a href="#"><i className="os-icon os-icon-signs-11" /><span>Logout</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="menu-actions">
              {/*------------------
START - Messages Link in secondary top menu
------------------*/}
              <div className="messages-notifications os-dropdown-trigger os-dropdown-position-right"><i className="os-icon os-icon-mail-14" />
                <div className="new-messages-count">12</div>
                <div className="os-dropdown light message-list">
                  <ul>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar1.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">John Mayers</h6>
                          <h6 className="message-title">Account Update</h6></div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar2.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">Phil Jones</h6>
                          <h6 className="message-title">Secutiry Updates</h6></div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar3.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">Bekky Simpson</h6>
                          <h6 className="message-title">Vacation Rentals</h6></div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar4.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">Alice Priskon</h6>
                          <h6 className="message-title">Payment Confirmation</h6></div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/*------------------
END - Messages Link in secondary top menu
------------------*/}
              {/*------------------
START - Settings Link in secondary top menu
------------------*/}
              <div className="top-icon top-settings os-dropdown-trigger os-dropdown-position-right"><i className="os-icon os-icon-ui-46" />
                <div className="os-dropdown">
                  <div className="icon-w"><i className="os-icon os-icon-ui-46" /></div>
                  <ul>
                    <li><a href="users_profile_small.html"><i className="os-icon os-icon-ui-49" /><span>Profile Settings</span></a></li>
                    <li><a href="users_profile_small.html"><i className="os-icon os-icon-grid-10" /><span>Billing Info</span></a></li>
                    <li><a href="users_profile_small.html"><i className="os-icon os-icon-ui-44" /><span>My Invoices</span></a></li>
                    <li><a href="users_profile_small.html"><i className="os-icon os-icon-ui-15" /><span>Cancel Account</span></a></li>
                  </ul>
                </div>
              </div>
              {/*------------------
END - Settings Link in secondary top menu
------------------*/}
              {/*------------------
START - Messages Link in secondary top menu
------------------*/}
              <div className="messages-notifications os-dropdown-trigger os-dropdown-position-right"><i className="os-icon os-icon-zap" />
                <div className="new-messages-count">4</div>
                <div className="os-dropdown light message-list">
                  <div className="icon-w"><i className="os-icon os-icon-zap" /></div>
                  <ul>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar1.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">John Mayers</h6>
                          <h6 className="message-title">Account Update</h6></div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar2.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">Phil Jones</h6>
                          <h6 className="message-title">Secutiry Updates</h6></div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar3.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">Bekky Simpson</h6>
                          <h6 className="message-title">Vacation Rentals</h6></div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="user-avatar-w"><img alt src="img/avatar4.jpg" /></div>
                        <div className="message-content">
                          <h6 className="message-from">Alice Priskon</h6>
                          <h6 className="message-title">Payment Confirmation</h6></div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/*------------------
END - Messages Link in secondary top menu
------------------*/}
            </div>
            <div className="element-search autosuggest-search-activator">
              <input placeholder="Start typing to search..." type="text" />
            </div>
            <h1 className="menu-page-header">Page Header</h1>
            <ul className="main-menu">
              <li className="sub-header"><span>Layouts</span></li>
              <li className="selected has-sub-menu">
                <a href="index.html">
                  <div className="icon-w">
                    <div className="os-icon os-icon-layout" />
                  </div><span>Dashboard</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Dashboard</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-layout" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="index.html">Dashboard 1</a></li>
                      <li><a href="apps_crypto.html">Crypto Dashboard <strong className="badge badge-danger">Hot</strong></a></li>
                      <li><a href="apps_support_dashboard.html">Dashboard 3</a></li>
                      <li><a href="apps_projects.html">Dashboard 4</a></li>
                      <li><a href="apps_bank.html">Dashboard 5</a></li>
                      <li><a href="layouts_menu_top_image.html">Dashboard 6</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="layouts_menu_top_image.html">
                  <div className="icon-w">
                    <div className="os-icon os-icon-layers" />
                  </div><span>Menu Styles</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Menu Styles</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-layers" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="layouts_menu_side_full.html">Side Menu Light</a></li>
                      <li><a href="layouts_menu_side_full_dark.html">Side Menu Dark</a></li>
                      <li><a href="layouts_menu_side_transparent.html">Side Menu Transparent <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="apps_pipeline.html">Side &amp; Top Dark</a></li>
                      <li><a href="apps_projects.html">Side &amp; Top</a></li>
                      <li><a href="layouts_menu_side_mini.html">Mini Side Menu</a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="layouts_menu_side_mini_dark.html">Mini Menu Dark</a></li>
                      <li><a href="layouts_menu_side_compact.html">Compact Side Menu</a></li>
                      <li><a href="layouts_menu_side_compact_dark.html">Compact Menu Dark</a></li>
                      <li><a href="layouts_menu_right.html">Right Menu</a></li>
                      <li><a href="layouts_menu_top.html">Top Menu Light</a></li>
                      <li><a href="layouts_menu_top_dark.html">Top Menu Dark</a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="layouts_menu_top_image.html">Top Menu Image <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="layouts_menu_sub_style_flyout.html">Sub Menu Flyout</a></li>
                      <li><a href="layouts_menu_sub_style_flyout_dark.html">Sub Flyout Dark</a></li>
                      <li><a href="layouts_menu_sub_style_flyout_bright.html">Sub Flyout Bright</a></li>
                      <li><a href="layouts_menu_side_compact_click.html">Menu Inside Click</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="sub-header"><span>Options</span></li>
              <li className="has-sub-menu">
                <a href="apps_bank.html">
                  <div className="icon-w">
                    <div className="os-icon os-icon-package" />
                  </div><span>Applications</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Applications</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-package" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="apps_email.html">Email Application</a></li>
                      <li><a href="apps_support_dashboard.html">Support Dashboard</a></li>
                      <li><a href="apps_support_index.html">Tickets Index</a></li>
                      <li><a href="apps_crypto.html">Crypto Dashboard <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="apps_projects.html">Projects List</a></li>
                      <li><a href="apps_bank.html">Banking <strong className="badge badge-danger">New</strong></a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="apps_full_chat.html">Chat Application</a></li>
                      <li><a href="apps_todo.html">To Do Application <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="misc_chat.html">Popup Chat</a></li>
                      <li><a href="apps_pipeline.html">CRM Pipeline</a></li>
                      <li><a href="rentals_index_grid.html">Property Listing <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="misc_calendar.html">Calendar</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-file-text" />
                  </div><span>Pages</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Pages</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-file-text" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="misc_invoice.html">Invoice</a></li>
                      <li><a href="rentals_index_grid.html">Property Listing <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="misc_charts.html">Charts</a></li>
                      <li><a href="auth_login.html">Login</a></li>
                      <li><a href="auth_register.html">Register</a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="auth_lock.html">Lock Screen</a></li>
                      <li><a href="misc_pricing_plans.html">Pricing Plans</a></li>
                      <li><a href="misc_error_404.html">Error 404</a></li>
                      <li><a href="misc_error_500.html">Error 500</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-life-buoy" />
                  </div><span>UI Kit</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">UI Kit</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-life-buoy" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="uikit_modals.html">Modals <strong className="badge badge-danger">New</strong></a></li>
                      <li><a href="uikit_alerts.html">Alerts</a></li>
                      <li><a href="uikit_grid.html">Grid</a></li>
                      <li><a href="uikit_progress.html">Progress</a></li>
                      <li><a href="uikit_popovers.html">Popover</a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="uikit_tooltips.html">Tooltips</a></li>
                      <li><a href="uikit_buttons.html">Buttons</a></li>
                      <li><a href="uikit_dropdowns.html">Dropdowns</a></li>
                      <li><a href="uikit_typography.html">Typography</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="sub-header"><span>Elements</span></li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-mail" />
                  </div><span>Emails</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Emails</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-mail" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="emails_welcome.html">Welcome Email</a></li>
                      <li><a href="emails_order.html">Order Confirmation</a></li>
                      <li><a href="emails_payment_due.html">Payment Due</a></li>
                      <li><a href="emails_forgot.html">Forgot Password</a></li>
                      <li><a href="emails_activate.html">Activate Account</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-users" />
                  </div><span>Users</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Users</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-users" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="users_profile_big.html">Big Profile</a></li>
                      <li><a href="users_profile_small.html">Compact Profile</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-edit-32" />
                  </div><span>Forms</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Forms</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-edit-32" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="forms_regular.html">Regular Forms</a></li>
                      <li><a href="forms_validation.html">Form Validation</a></li>
                      <li><a href="forms_wizard.html">Form Wizard</a></li>
                      <li><a href="forms_uploads.html">File Uploads</a></li>
                      <li><a href="forms_wisiwig.html">Wisiwig Editor</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-grid" />
                  </div><span>Tables</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Tables</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-grid" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="tables_regular.html">Regular Tables</a></li>
                      <li><a href="tables_datatables.html">Data Tables</a></li>
                      <li><a href="tables_editable.html">Editable Tables</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-sub-menu">
                <a href="#">
                  <div className="icon-w">
                    <div className="os-icon os-icon-zap" />
                  </div><span>Icons</span></a>
                <div className="sub-menu-w">
                  <div className="sub-menu-header">Icons</div>
                  <div className="sub-menu-icon"><i className="os-icon os-icon-zap" /></div>
                  <div className="sub-menu-i">
                    <ul className="sub-menu">
                      <li><a href="icon_fonts_simple_line_icons.html">Simple Line Icons</a></li>
                      <li><a href="icon_fonts_feather.html">Feather Icons</a></li>
                      <li><a href="icon_fonts_themefy.html">Themefy Icons</a></li>
                      <li><a href="icon_fonts_picons_thin.html">Picons Thin</a></li>
                      <li><a href="icon_fonts_dripicons.html">Dripicons</a></li>
                      <li><a href="icon_fonts_eightyshades.html">Eightyshades</a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="icon_fonts_entypo.html">Entypo</a></li>
                      <li><a href="icon_fonts_font_awesome.html">Font Awesome</a></li>
                      <li><a href="icon_fonts_foundation_icon_font.html">Foundation Icon Font</a></li>
                      <li><a href="icon_fonts_metrize_icons.html">Metrize Icons</a></li>
                      <li><a href="icon_fonts_picons_social.html">Picons Social</a></li>
                      <li><a href="icon_fonts_batch_icons.html">Batch Icons</a></li>
                    </ul>
                    <ul className="sub-menu">
                      <li><a href="icon_fonts_dashicons.html">Dashicons</a></li>
                      <li><a href="icon_fonts_typicons.html">Typicons</a></li>
                      <li><a href="icon_fonts_weather_icons.html">Weather Icons</a></li>
                      <li><a href="icon_fonts_light_admin.html">Light Admin</a></li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
            <div className="side-menu-magic">
              <h4>Light Admin</h4>
              <p>Clean Bootstrap 4 Template</p>
              <div className="btn-w"><a className="btn btn-white btn-rounded" href="https://themeforest.net/item/light-admin-clean-bootstrap-dashboard-html-template/19760124?ref=Osetin" target="_blank">Purchase Now</a></div>
            </div>
          </div>
          {/*------------------
END - Main Menu
------------------*/}
          <div className="content-w">
            {/*------------------
START - Top Bar
------------------*/}
            <div className="top-bar color-scheme-transparent d-none">
              {/*------------------
START - Top Menu Controls
------------------*/}
              <div className="top-menu-controls">
                <div className="element-search autosuggest-search-activator">
                  <input placeholder="Start typing to search..." type="text" />
                </div>
                {/*------------------
START - Messages Link in secondary top menu
------------------*/}
                <div className="messages-notifications os-dropdown-trigger os-dropdown-position-left"><i className="os-icon os-icon-mail-14" />
                  <div className="new-messages-count">12</div>
                  <div className="os-dropdown light message-list">
                    <ul>
                      <li>
                        <a href="#">
                          <div className="user-avatar-w"><img alt src="img/avatar1.jpg" /></div>
                          <div className="message-content">
                            <h6 className="message-from">John Mayers</h6>
                            <h6 className="message-title">Account Update</h6></div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="user-avatar-w"><img alt src="img/avatar2.jpg" /></div>
                          <div className="message-content">
                            <h6 className="message-from">Phil Jones</h6>
                            <h6 className="message-title">Secutiry Updates</h6></div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="user-avatar-w"><img alt src="img/avatar3.jpg" /></div>
                          <div className="message-content">
                            <h6 className="message-from">Bekky Simpson</h6>
                            <h6 className="message-title">Vacation Rentals</h6></div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="user-avatar-w"><img alt src="img/avatar4.jpg" /></div>
                          <div className="message-content">
                            <h6 className="message-from">Alice Priskon</h6>
                            <h6 className="message-title">Payment Confirmation</h6></div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/*------------------
END - Messages Link in secondary top menu
------------------*/}
                {/*------------------
START - Settings Link in secondary top menu
------------------*/}
                <div className="top-icon top-settings os-dropdown-trigger os-dropdown-position-left"><i className="os-icon os-icon-ui-46" />
                  <div className="os-dropdown">
                    <div className="icon-w"><i className="os-icon os-icon-ui-46" /></div>
                    <ul>
                      <li><a href="users_profile_small.html"><i className="os-icon os-icon-ui-49" /><span>Profile Settings</span></a></li>
                      <li><a href="users_profile_small.html"><i className="os-icon os-icon-grid-10" /><span>Billing Info</span></a></li>
                      <li><a href="users_profile_small.html"><i className="os-icon os-icon-ui-44" /><span>My Invoices</span></a></li>
                      <li><a href="users_profile_small.html"><i className="os-icon os-icon-ui-15" /><span>Cancel Account</span></a></li>
                    </ul>
                  </div>
                </div>
                {/*------------------
END - Settings Link in secondary top menu
------------------*/}
                {/*------------------
START - User avatar and menu in secondary top menu
------------------*/}
                <div className="logged-user-w">
                  <div className="logged-user-i">
                    <div className="avatar-w"><img alt src="img/avatar1.jpg" /></div>
                    <div className="logged-user-menu color-style-bright">
                      <div className="logged-user-avatar-info">
                        <div className="avatar-w"><img alt src="img/avatar1.jpg" /></div>
                        <div className="logged-user-info-w">
                          <div className="logged-user-name">Maria Gomez</div>
                          <div className="logged-user-role">Administrator</div>
                        </div>
                      </div>
                      <div className="bg-icon"><i className="os-icon os-icon-wallet-loaded" /></div>
                      <ul>
                        <li><a href="apps_email.html"><i className="os-icon os-icon-mail-01" /><span>Incoming Mail</span></a></li>
                        <li><a href="users_profile_big.html"><i className="os-icon os-icon-user-male-circle2" /><span>Profile Details</span></a></li>
                        <li><a href="users_profile_small.html"><i className="os-icon os-icon-coins-4" /><span>Billing Details</span></a></li>
                        <li><a href="#"><i className="os-icon os-icon-others-43" /><span>Notifications</span></a></li>
                        <li><a href="#"><i className="os-icon os-icon-signs-11" /><span>Logout</span></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/*------------------
END - User avatar and menu in secondary top menu
------------------*/}
              </div>
              {/*------------------
END - Top Menu Controls
------------------*/}
            </div>
            {/*------------------
END - Top Bar
------------------*/}
            {/*------------------
START - Breadcrumbs
------------------*/}
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="index.html">Home</a></li>
              <li className="breadcrumb-item"><a href="index.html">Products</a></li>
              <li className="breadcrumb-item"><span>Laptop with retina screen</span></li>
            </ul>
            {/*------------------
END - Breadcrumbs
------------------*/}
            <div className="content-i">
              <div className="content-box">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="element-wrapper">
                      <h6 className="element-header">Dashboard Box</h6>
                      <div className="element-box">
                        <div className="element-info">
                          <div className="row align-items-center">
                            <div className="col-sm-8">
                              <div className="element-info-with-icon">
                                <div className="element-info-icon">
                                  <div className="os-icon os-icon-wallet-loaded" />
                                </div>
                                <div className="element-info-text">
                                  <h5 className="element-inner-header">Sales Statistics</h5>
                                  <div className="element-inner-desc">Discharge best employed your phase each the of shine. Be met even.</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="element-search">
                                <input placeholder="Type to search for products..." type="text" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-xl-4">
                            <div className="row">
                              <div className="col-sm-6 b-r b-b">
                                <div className="el-tablo centered padded">
                                  <div className="value">3814</div>
                                  <div className="label">Products Sold</div>
                                </div>
                              </div>
                              <div className="col-sm-6 b-b">
                                <div className="el-tablo centered padded">
                                  <div className="value">47.5K</div>
                                  <div className="label">Followers</div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6 b-r">
                                <div className="el-tablo centered padded">
                                  <div className="value">$95</div>
                                  <div className="label">Daily Earnings</div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="el-tablo centered padded">
                                  <div className="value">12</div>
                                  <div className="label">Products</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-xl-4">
                            <div className="padded b-l b-r-xl">
                              <div className="element-info-with-icon smaller">
                                <div className="element-info-icon">
                                  <div className="os-icon os-icon-bar-chart-stats-up" />
                                </div>
                                <div className="element-info-text">
                                  <h5 className="element-inner-header">Monthly Revenue</h5>
                                  <div className="element-inner-desc">Calculated every month</div>
                                </div>
                              </div>
                              <div className="os-progress-bar primary">
                                <div className="bar-labels">
                                  <div className="bar-label-left"><span>Accessories</span><span className="positive">+10</span></div>
                                  <div className="bar-label-right"><span className="info">72/100</span></div>
                                </div>
                                <div className="bar-level-1" style={{width: '100%'}}>
                                  <div className="bar-level-2" style={{width: '60%'}}>
                                    <div className="bar-level-3" style={{width: '20%'}} />
                                  </div>
                                </div>
                              </div>
                              <div className="os-progress-bar primary">
                                <div className="bar-labels">
                                  <div className="bar-label-left"><span>Shoe Sales</span><span className="negative">-5</span></div>
                                  <div className="bar-label-right"><span className="info">62/100</span></div>
                                </div>
                                <div className="bar-level-1" style={{width: '100%'}}>
                                  <div className="bar-level-2" style={{width: '40%'}}>
                                    <div className="bar-level-3" style={{width: '10%'}} />
                                  </div>
                                </div>
                              </div>
                              <div className="os-progress-bar primary">
                                <div className="bar-labels">
                                  <div className="bar-label-left"><span>New Customers</span><span className="positive">+12</span></div>
                                  <div className="bar-label-right"><span className="info">78/100</span></div>
                                </div>
                                <div className="bar-level-1" style={{width: '100%'}}>
                                  <div className="bar-level-2" style={{width: '80%'}}>
                                    <div className="bar-level-3" style={{width: '50%'}} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-none d-xl-block col-xl-4">
                            <div className="padded">
                              <div className="el-tablo bigger">
                                <div className="value">245</div>
                                <div className="trending trending-up"><span>12%</span><i className="os-icon os-icon-arrow-up2" /></div>
                                <div className="label">Products Sold</div>
                              </div>
                              <div className="el-chart-w">
                                <div className="chartjs-size-monitor" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                                  <div className="chartjs-size-monitor-expand" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                                    <div style={{position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0}} />
                                  </div>
                                  <div className="chartjs-size-monitor-shrink" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                                    <div style={{position: 'absolute', width: '200%', height: '200%', left: 0, top: 0}} />
                                  </div>
                                </div>
                                <canvas height={109} id="liteLineChart" width={329} className="chartjs-render-monitor" style={{display: 'block', width: 329, height: 109}} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4 col-lg-3 col-xxl-2">
                    <div className="element-wrapper">
                      <h6 className="element-header">Top Selling Today</h6>
                      <div className="element-box">
                        <div className="el-chart-w">
                          <div className="chartjs-size-monitor" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                            <div className="chartjs-size-monitor-expand" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                              <div style={{position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0}} />
                            </div>
                            <div className="chartjs-size-monitor-shrink" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                              <div style={{position: 'absolute', width: '200%', height: '200%', left: 0, top: 0}} />
                            </div>
                          </div>
                          <canvas height={218} id="donutChart" width={218} className="chartjs-render-monitor" style={{display: 'block', width: 218, height: 218}} />
                          <div className="inside-donut-chart-label"><strong>142</strong><span>Total Orders</span></div>
                        </div>
                        <div className="el-legend">
                          <div className="legend-value-w">
                            <div className="legend-pin" style={{backgroundColor: '#6896f9'}} />
                            <div className="legend-value">Processed</div>
                          </div>
                          <div className="legend-value-w">
                            <div className="legend-pin" style={{backgroundColor: '#85c751'}} />
                            <div className="legend-value">Cancelled</div>
                          </div>
                          <div className="legend-value-w">
                            <div className="legend-pin" style={{backgroundColor: '#d97b70'}} />
                            <div className="legend-value">Pending</div>
                          </div>
                          <div className="legend-value-w">
                            <div className="legend-pin" style={{backgroundColor: '#f2cd49'}} />
                            <div className="legend-value">Refunds</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8 col-lg-9 col-xl-6 col-xxl-7">
                    <div className="element-wrapper">
                      <h6 className="element-header">New Orders</h6>
                      <div className="element-box">
                        <div className="table-responsive">
                          <table className="table table-lightborder">
                            <thead>
                              <tr>
                                <th>Customer Name</th>
                                <th>Products Ordered</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Order Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="nowrap">John Mayers</td>
                                <td>
                                  <div className="cell-image-list">
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio9.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio2.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio12.jpg)'}} />
                                    <div className="cell-img-more">+ 5 more</div>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="text-right">$354</td>
                              </tr>
                              <tr>
                                <td className="nowrap">Kelly Brans</td>
                                <td>
                                  <div className="cell-image-list">
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio14.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio8.jpg)'}} />
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-pill red" data-title="Cancelled" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="text-right">$94</td>
                              </tr>
                              <tr>
                                <td className="nowrap">Tim Howard</td>
                                <td>
                                  <div className="cell-image-list">
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio16.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio14.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio5.jpg)'}} />
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="text-right">$156</td>
                              </tr>
                              <tr>
                                <td className="nowrap">Joe Trulli</td>
                                <td>
                                  <div className="cell-image-list">
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio1.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio5.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio6.jpg)'}} />
                                    <div className="cell-img-more">+ 2 more</div>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-pill yellow" data-title="Pending" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="text-right">$1,120</td>
                              </tr>
                              <tr>
                                <td className="nowrap">Jerry Lingard</td>
                                <td>
                                  <div className="cell-image-list">
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio9.jpg)'}} />
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="text-right">$856</td>
                              </tr>
                              <tr>
                                <td className="nowrap">Tim Howard</td>
                                <td>
                                  <div className="cell-image-list">
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio16.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio14.jpg)'}} />
                                    <div className="cell-img" style={{backgroundImage: 'url(img/portfolio5.jpg)'}} />
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="text-right">$156</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="element-wrapper">
                      <h6 className="element-header">Support Agents</h6>
                      <div className="element-box-tp">
                        <div className="profile-tile">
                          <a className="profile-tile-box" href="users_profile_small.html">
                            <div className="pt-avatar-w"><img alt src="img/avatar1.jpg" /></div>
                            <div className="pt-user-name">Mark Parson</div>
                          </a>
                          <div className="profile-tile-meta">
                            <ul>
                              <li>Last Login:<strong>Online Now</strong></li>
                              <li>Tickets:<strong>12</strong></li>
                              <li>Response Time:<strong>17 hours</strong></li>
                            </ul>
                            <div className="pt-btn"><a className="btn btn-success btn-sm" href="apps_full_chat.html">Send Message</a></div>
                          </div>
                        </div>
                        <div className="profile-tile">
                          <a className="profile-tile-box" href="users_profile_small.html">
                            <div className="pt-avatar-w"><img alt src="img/avatar2.jpg" /></div>
                            <div className="pt-user-name">John Mayers</div>
                          </a>
                          <div className="profile-tile-meta">
                            <ul>
                              <li>Last Login:<strong>Online Now</strong></li>
                              <li>Tickets:<strong>18</strong></li>
                              <li>Response Time:<strong>2 hours</strong></li>
                            </ul>
                            <div className="pt-btn"><a className="btn btn-secondary btn-sm" href="apps_full_chat.html">Send Message</a></div>
                          </div>
                        </div>
                        <div className="profile-tile d-sm-none d-xl-flex">
                          <a className="profile-tile-box" href="users_profile_small.html">
                            <div className="pt-avatar-w"><img alt src="img/avatar3.jpg" /></div>
                            <div className="pt-user-name">Mark Parson</div>
                          </a>
                          <div className="profile-tile-meta">
                            <ul>
                              <li>Last Login:<strong>Online Now</strong></li>
                              <li>Tickets:<strong>24</strong></li>
                              <li>Response Time:<strong>4 hours</strong></li>
                            </ul>
                            <div className="pt-btn"><a className="btn btn-success btn-sm" href="apps_full_chat.html">Send Message</a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-8 col-xl-12 col-xxl-6">
                    <div className="element-wrapper">
                      <h6 className="element-header">Unique Visitors Graph</h6>
                      <div className="element-box">
                        <div className="os-tabs-w">
                          <div className="os-tabs-controls">
                            <ul className="nav nav-tabs smaller">
                              <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#tab_overview">Overview</a></li>
                              <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_sales">Sales</a></li>
                            </ul>
                            <ul className="nav nav-pills smaller d-none d-xl-flex">
                              <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#">Today</a></li>
                              <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#">7 Days</a></li>
                              <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#">14 Days</a></li>
                              <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#">Last Month</a></li>
                            </ul>
                          </div>
                          <div className="tab-content">
                            <div className="tab-pane active" id="tab_overview">
                              <div className="el-tablo bigger">
                                <div className="label">Unique Visitors</div>
                                <div className="value">12,537</div>
                              </div>
                              <div className="el-chart-w">
                                <div className="chartjs-size-monitor" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                                  <div className="chartjs-size-monitor-expand" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                                    <div style={{position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0}} />
                                  </div>
                                  <div className="chartjs-size-monitor-shrink" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1}}>
                                    <div style={{position: 'absolute', width: '200%', height: '200%', left: 0, top: 0}} />
                                  </div>
                                </div>
                                <canvas height={281} id="lineChart" width={1124} className="chartjs-render-monitor" style={{display: 'block', width: 1124, height: 281}} />
                              </div>
                            </div>
                            <div className="tab-pane" id="tab_sales" />
                            <div className="tab-pane" id="tab_conversion" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-xxl-6">
                    <div className="element-wrapper">
                      <h6 className="element-header">Recent Orders</h6>
                      <div className="element-box-tp">
                        {/*------------------
START - Controls Above Table
------------------*/}
                        <div className="controls-above-table">
                          <div className="row">
                            <div className="col-sm-6"><a className="btn btn-sm btn-secondary" href="#">Download CSV</a><a className="btn btn-sm btn-secondary" href="#">Archive</a><a className="btn btn-sm btn-danger" href="#">Delete</a></div>
                            <div className="col-sm-6">
                              <form className="form-inline justify-content-sm-end">
                                <input className="form-control form-control-sm rounded bright" placeholder="Search" type="text" />
                                <select className="form-control form-control-sm rounded bright">
                                  <option selected="selected" value>Select Status</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Active">Active</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </form>
                            </div>
                          </div>
                        </div>
                        {/*------------------
END - Controls Above Table
------------------          */}
                        {/*------------------
START - Table with actions
------------------  */}
                        <div className="table-responsive">
                          <table className="table table-bordered table-lg table-v2 table-striped">
                            <thead>
                              <tr>
                                <th className="text-center">
                                  <input className="form-control" type="checkbox" />
                                </th>
                                <th>Customer Name</th>
                                <th>Country</th>
                                <th>Order Total</th>
                                <th>Referral</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">
                                  <input className="form-control" type="checkbox" />
                                </td>
                                <td>John Mayers</td>
                                <td><img alt src="img/flags-icons/us.png" width="25px" /></td>
                                <td className="text-right">$245</td>
                                <td>Organic</td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="row-actions"><a href="#"><i className="os-icon os-icon-ui-49" /></a><a href="#"><i className="os-icon os-icon-grid-10" /></a><a className="danger" href="#"><i className="os-icon os-icon-ui-15" /></a></td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  <input className="form-control" type="checkbox" />
                                </td>
                                <td>Mike Astone</td>
                                <td><img alt src="img/flags-icons/fr.png" width="25px" /></td>
                                <td className="text-right">$154</td>
                                <td>Organic</td>
                                <td className="text-center">
                                  <div className="status-pill red" data-title="Cancelled" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="row-actions"><a href="#"><i className="os-icon os-icon-ui-49" /></a><a href="#"><i className="os-icon os-icon-grid-10" /></a><a className="danger" href="#"><i className="os-icon os-icon-ui-15" /></a></td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  <input className="form-control" type="checkbox" />
                                </td>
                                <td>Kira Knight</td>
                                <td><img alt src="img/flags-icons/us.png" width="25px" /></td>
                                <td className="text-right">$23</td>
                                <td>Adwords</td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="row-actions"><a href="#"><i className="os-icon os-icon-ui-49" /></a><a href="#"><i className="os-icon os-icon-grid-10" /></a><a className="danger" href="#"><i className="os-icon os-icon-ui-15" /></a></td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  <input className="form-control" type="checkbox" />
                                </td>
                                <td>Jessica Bloom</td>
                                <td><img alt src="img/flags-icons/ca.png" width="25px" /></td>
                                <td className="text-right">$112</td>
                                <td>Organic</td>
                                <td className="text-center">
                                  <div className="status-pill green" data-title="Complete" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="row-actions"><a href="#"><i className="os-icon os-icon-ui-49" /></a><a href="#"><i className="os-icon os-icon-grid-10" /></a><a className="danger" href="#"><i className="os-icon os-icon-ui-15" /></a></td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  <input className="form-control" type="checkbox" />
                                </td>
                                <td>Gary Lineker</td>
                                <td><img alt src="img/flags-icons/ca.png" width="25px" /></td>
                                <td className="text-right">$64</td>
                                <td>Organic</td>
                                <td className="text-center">
                                  <div className="status-pill yellow" data-title="Pending" data-toggle="tooltip" data-original-title title />
                                </td>
                                <td className="row-actions"><a href="#"><i className="os-icon os-icon-ui-49" /></a><a href="#"><i className="os-icon os-icon-grid-10" /></a><a className="danger" href="#"><i className="os-icon os-icon-ui-15" /></a></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/*------------------
END - Table with actions
------------------            */}
                        {/*------------------
START - Controls below table
------------------  */}
                        <div className="controls-below-table">
                          <div className="table-records-info">Showing records 1 - 5</div>
                          <div className="table-records-pages">
                            <ul>
                              <li><a href="#">Previous</a></li>
                              <li><a className="current" href="#">1</a></li>
                              <li><a href="#">2</a></li>
                              <li><a href="#">3</a></li>
                              <li><a href="#">4</a></li>
                              <li><a href="#">Next</a></li>
                            </ul>
                          </div>
                        </div>
                        {/*------------------
END - Controls below table
------------------*/}
                      </div>
                    </div>
                  </div>
                </div>
                {/*------------------
START - Color Scheme Toggler
------------------*/}
                <div className="floated-colors-btn second-floated-btn">
                  <div className="os-toggler-w">
                    <div className="os-toggler-i">
                      <div className="os-toggler-pill" />
                    </div>
                  </div><span>Dark </span><span>Colors</span></div>
                {/*------------------
END - Color Scheme Toggler
------------------*/}
                {/*------------------
START - Demo Customizer
------------------*/}
                <div className="floated-customizer-btn third-floated-btn">
                  <div className="icon-w"><i className="os-icon os-icon-ui-46" /></div><span>Customizer</span></div>
                <div className="floated-customizer-panel">
                  <div className="fcp-content">
                    <div className="close-customizer-btn"><i className="os-icon os-icon-x" /></div>
                    <div className="fcp-group">
                      <div className="fcp-group-header">Menu Settings</div>
                      <div className="fcp-group-contents">
                        <div className="fcp-field">
                          <label htmlFor>Menu Position</label>
                          <select className="menu-position-selector">
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="top">Top</option>
                          </select>
                        </div>
                        <div className="fcp-field">
                          <label htmlFor>Menu Style</label>
                          <select className="menu-layout-selector">
                            <option value="compact">Compact</option>
                            <option value="full">Full</option>
                            <option value="mini">Mini</option>
                          </select>
                        </div>
                        <div className="fcp-field with-image-selector-w">
                          <label htmlFor>With Image</label>
                          <select className="with-image-selector">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                        <div className="fcp-field">
                          <label htmlFor>Menu Color</label>
                          <div className="fcp-colors menu-color-selector">
                            <div className="color-selector menu-color-selector color-bright selected" />
                            <div className="color-selector menu-color-selector color-dark" />
                            <div className="color-selector menu-color-selector color-light" />
                            <div className="color-selector menu-color-selector color-transparent" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="fcp-group">
                      <div className="fcp-group-header">Sub Menu</div>
                      <div className="fcp-group-contents">
                        <div className="fcp-field">
                          <label htmlFor>Sub Menu Style</label>
                          <select className="sub-menu-style-selector">
                            <option value="flyout">Flyout</option>
                            <option value="inside">Inside/Click</option>
                            <option value="over">Over</option>
                          </select>
                        </div>
                        <div className="fcp-field">
                          <label htmlFor>Sub Menu Color</label>
                          <div className="fcp-colors">
                            <div className="color-selector sub-menu-color-selector color-bright selected" />
                            <div className="color-selector sub-menu-color-selector color-dark" />
                            <div className="color-selector sub-menu-color-selector color-light" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="fcp-group">
                      <div className="fcp-group-header">Other Settings</div>
                      <div className="fcp-group-contents">
                        <div className="fcp-field">
                          <label htmlFor>Full Screen?</label>
                          <select className="full-screen-selector">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                        <div className="fcp-field">
                          <label htmlFor>Show Top Bar</label>
                          <select className="top-bar-visibility-selector">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                        <div className="fcp-field">
                          <label htmlFor>Above Menu?</label>
                          <select className="top-bar-above-menu-selector">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                        <div className="fcp-field">
                          <label htmlFor>Top Bar Color</label>
                          <div className="fcp-colors">
                            <div className="color-selector top-bar-color-selector color-bright" />
                            <div className="color-selector top-bar-color-selector color-dark" />
                            <div className="color-selector top-bar-color-selector color-light" />
                            <div className="color-selector top-bar-color-selector color-transparent selected" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*------------------
END - Demo Customizer
------------------*/}
                {/*------------------
START - Chat Popup Box
------------------*/}
                <div className="floated-chat-btn"><i className="os-icon os-icon-mail-07" /><span>Demo Chat</span></div>
                <div className="floated-chat-w">
                  <div className="floated-chat-i">
                    <div className="chat-close"><i className="os-icon os-icon-close" /></div>
                    <div className="chat-head">
                      <div className="user-w with-status status-green">
                        <div className="user-avatar-w">
                          <div className="user-avatar"><img alt src="img/avatar1.jpg" /></div>
                        </div>
                        <div className="user-name">
                          <h6 className="user-title">John Mayers</h6>
                          <div className="user-role">Account Manager</div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-messages ps ps--theme_default" data-ps-id="b2682bc9-693b-1da7-0933-2a1d299f4ad7">
                      <div className="message">
                        <div className="message-content">Hi, how can I help you?</div>
                      </div>
                      <div className="date-break">Mon 10:20am</div>
                      <div className="message">
                        <div className="message-content">Hi, my name is Mike, I will be happy to assist you</div>
                      </div>
                      <div className="message self">
                        <div className="message-content">Hi, I tried ordering this product and it keeps showing me error code.</div>
                      </div>
                      <div className="ps__scrollbar-x-rail" style={{left: 0, bottom: 0}}>
                        <div className="ps__scrollbar-x" tabIndex={0} style={{left: 0, width: 0}} />
                      </div>
                      <div className="ps__scrollbar-y-rail" style={{top: 0, right: 0}}>
                        <div className="ps__scrollbar-y" tabIndex={0} style={{top: 0, height: 0}} />
                      </div>
                    </div>
                    <div className="chat-controls">
                      <input className="message-input" placeholder="Type your message here..." type="text" />
                      <div className="chat-extra"><a href="#"><span className="extra-tooltip">Attach Document</span><i className="os-icon os-icon-documents-07" /></a><a href="#"><span className="extra-tooltip">Insert Photo</span><i className="os-icon os-icon-others-29" /></a><a href="#"><span className="extra-tooltip">Upload Video</span><i className="os-icon os-icon-ui-51" /></a></div>
                    </div>
                  </div>
                </div>
                {/*------------------
END - Chat Popup Box
------------------*/}
              </div>
            </div>
          </div>
        </div>
        <div className="display-type" />
      </div>
    );
  }
}


export default Test