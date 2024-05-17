<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page trimDirectiveWhitespaces="true" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="vertical-box with-grid inbox">
    <div class="vertical-box-column width-200 bg-silver hidden-xs">
        <!-- begin vertical-box -->
        <div class="vertical-box">
            <!-- begin wrapper -->
            <div class="wrapper bg-silver text-center">
                <a href="#pages/email_compose.html" data-toggle="ajax" class="btn btn-inverse p-l-40 p-r-40 btn-sm">
                    Compose
                </a>
            </div>

            <div class="vertical-box-row">
                <div class="vertical-box-cell">
                    <div class="vertical-box-inner-cell">
                        <div data-scrollbar="true" data-height="100%">
                            <div class="wrapper p-0">
                                <div class="nav-title"><b>FOLDERS</b></div>
                                <ul class="nav nav-inbox">
                                    <li class="active"><a href="#pages/email_inbox.html" data-toggle="ajax"><i class="fa fa-inbox fa-fw m-r-5"></i> Inbox <span class="badge pull-right">52</span></a></li>
                                    <li><a href="#pages/email_inbox.html" data-toggle="ajax"><i class="fa fa-flag fa-fw m-r-5"></i> Important</a></li>
                                    <li><a href="#pages/email_inbox.html" data-toggle="ajax"><i class="fa fa-envelope fa-fw m-r-5"></i> Sent</a></li>
                                    <li><a href="#pages/email_inbox.html" data-toggle="ajax"><i class="fa fa-trash fa-fw m-r-5"></i> Trash</a></li>
                                </ul>
                                <div class="nav-title"><b>LABEL</b></div>
                                <ul class="nav nav-inbox">
                                    <li><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-inverse"></i> Admin</a></li>
                                    <li><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-primary"></i> Designer & Employer</a></li>
                                    <li><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-success"></i> Staff</a></li>
                                    <li><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-warning"></i> Sponsorer</a></li>
                                    <li><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-danger"></i> Client</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="vertical-box-column bg-white">
        <div class="vertical-box">
            <div class="vertical-box-row">
                <div class="vertical-box-cell">
                    <div class="vertical-box-inner-cell">
                        <div data-scrollbar="true" data-height="100%">
                            <ul class="list-group list-group-lg no-radius list-email">
                                <li class="list-group-item unread">
                                    <div class="email-checkbox">
                                        <label>
                                            <i class="far fa-square"></i>
                                            <input type="checkbox" data-checked="email-checkbox" />
                                        </label>
                                    </div>
                                    <a href="#pages/email_detail.html" data-toggle="ajax" class="email-user bg-gradient-blue">
                                        <span class="text-white">F</span>
                                    </a>
                                    <div class="email-info">
                                        <a href="#pages/email_detail.html" data-toggle="ajax">
                                            <span class="email-time">Today</span>
                                            <span class="email-sender">Facebook Blueprint</span>
                                            <span class="email-title">Newly released courses, holiday marketing tips, how-to video, and more!</span>
                                            <span class="email-desc">Sed scelerisque dui lacus, quis pellentesque lorem tincidunt rhoncus. Nulla accumsan elit pharetra, lacinia turpis nec, varius erat.</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="list-group-item unread">
                                    <div class="email-checkbox">
                                        <label>
                                            <i class="far fa-square"></i>
                                            <input type="checkbox" data-checked="email-checkbox" />
                                        </label>
                                    </div>
                                    <a href="#pages/email_detail.html" data-toggle="ajax" class="email-user bg-gradient-purple">
                                        <span class="text-white">C</span>
                                    </a>
                                    <div class="email-info">
                                        <a href="#pages/email_detail.html" data-toggle="ajax">
                                            <span class="email-time">Today</span>
                                            <span class="email-sender">Color Admin</span>
                                            <span class="email-title">Color Admin dashboard v2 is ready for live</span>
                                            <span class="email-desc">Proin interdum aliquam urna, quis lobortis magna tincidunt ac. Integer sed pulvinar neque...</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="list-group-item unread">
                                    <div class="email-checkbox">
                                        <label>
                                            <i class="far fa-square"></i>
                                            <input type="checkbox" data-checked="email-checkbox" />
                                        </label>
                                    </div>
                                    <a href="#pages/email_detail.html" data-toggle="ajax" class="email-user bg-grey">
                                        <span class="text-white">W</span>
                                    </a>
                                    <div class="email-info">
                                        <a href="#pages/email_detail.html" data-toggle="ajax">
                                            <span class="email-time">Today</span>
                                            <span class="email-sender">support@wrapbootstrap.com</span>
                                            <span class="email-title">Bootstrap v4.0 is coming soon</span>
                                            <span class="email-desc">Praesent id pulvinar orci. Donec ac metus non ligula faucibus venenatis. Suspendisse tortor est, placerat eu dui sed...</span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wrapper bg-silver-lighter clearfix">
                <div class="btn-group pull-right">
                    <button class="btn btn-white btn-sm">
                        <i class="fa fa-chevron-left f-s-14 t-plus-1"></i>
                    </button>
                    <button class="btn btn-white btn-sm">
                        <i class="fa fa-chevron-right f-s-14 t-plus-1"></i>
                    </button>
                </div>
                <div class="m-t-5 text-inverse f-w-600">1,232 messages</div>
            </div>
        </div>
    </div>
</div>

<script src="assets/js/apps.js"></script>
<script>
    App.setPageOption({
        pageContentFullHeight: true,
        pageContentFullWidth: true
    });
</script>