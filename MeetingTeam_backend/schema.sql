create table channel (channel_name varchar(255), description TEXT, id varchar(255) not null, team_id varchar(255), type varchar(255), primary key (id)) engine=InnoDB;
create table friend_relation (friend1id varchar(255) not null, friend2id varchar(255) not null, id varchar(255) not null, status varchar(255), primary key (id)) engine=InnoDB;
create table meeting (is_active bit, is_canceled bit not null, created_at datetime(6), end_date datetime(6), scheduled_time datetime(6), channel_id varchar(255) not null, creator_id varchar(255) not null, emails_received_notification TEXT, id varchar(255) not null, reactions TEXT, scheduled_days_of_week varchar(255), title varchar(255), primary key (id)) engine=InnoDB;
create table message (id integer not null auto_increment, created_at datetime(6), channel_id varchar(255), content TEXT, file_name varchar(255), message_type varchar(255), parent_message_id varchar(255), reactions TEXT, recipient_id varchar(255), sender_id varchar(255), voting TEXT, primary key (id)) engine=InnoDB;
create table request_message (id integer not null auto_increment, created_at datetime(6), content TEXT, recipient_id varchar(255), sender_id varchar(255), team_id varchar(255), primary key (id)) engine=InnoDB;
create table role (id integer not null auto_increment, role_name varchar(255), primary key (id)) engine=InnoDB;
create table team (auto_add_member bit, id varchar(255) not null, team_name varchar(255), url_icon varchar(255), primary key (id)) engine=InnoDB;
create table team_member (id varchar(255) not null, role varchar(255), team_id varchar(255), u_id varchar(255), primary key (id)) engine=InnoDB;
create table user (birthday date, is_activated bit, role_id integer, last_active datetime(6), otptime datetime(6), calendar_meeting_ids TEXT, email varchar(255) not null, id varchar(255) not null, nick_name varchar(255), otpcode varchar(255), password varchar(255), phone_number varchar(255), provider varchar(255), status varchar(255), url_icon varchar(255), primary key (id)) engine=InnoDB;
alter table user add constraint UK_ob8kqyqqgmefl0aco34akdtpe unique (email);
alter table channel add constraint FK63ug4lh1q6hpxuyqhbs6xm1v8 foreign key (team_id) references team (id);
alter table friend_relation add constraint FKmatnqyj8jw40dbbtot5r3sb5g foreign key (friend1id) references user (id);
alter table friend_relation add constraint FKgu2p55c56acoat5a722x7xfy3 foreign key (friend2id) references user (id);
alter table request_message add constraint FKehcv7bl7n9ukmwywym8rqltd foreign key (recipient_id) references user (id);
alter table request_message add constraint FK99wgcsvrb8x8lpta52o87sa07 foreign key (sender_id) references user (id);
alter table request_message add constraint FK6wwioc8pydletyq16k3wyv6kh foreign key (team_id) references team (id);
alter table team_member add constraint FK9ubp79ei4tv4crd0r9n7u5i6e foreign key (team_id) references team (id);
alter table team_member add constraint FKq5cajxrxxx7x4sytrwxhffhon foreign key (u_id) references user (id);
alter table user add constraint FKn82ha3ccdebhokx3a8fgdqeyy foreign key (role_id) references role (id);
create table channel (channel_name varchar(255), description TEXT, id varchar(255) not null, team_id varchar(255), type varchar(255), primary key (id)) engine=InnoDB;
create table friend_relation (friend1id varchar(255) not null, friend2id varchar(255) not null, id varchar(255) not null, status varchar(255), primary key (id)) engine=InnoDB;
create table meeting (is_active bit, is_canceled bit not null, created_at datetime(6), end_date datetime(6), scheduled_time datetime(6), channel_id varchar(255) not null, creator_id varchar(255) not null, emails_received_notification TEXT, id varchar(255) not null, reactions TEXT, scheduled_days_of_week varchar(255), title varchar(255), primary key (id)) engine=InnoDB;
create table message (id integer not null auto_increment, created_at datetime(6), channel_id varchar(255), content TEXT, file_name varchar(255), message_type varchar(255), parent_message_id varchar(255), reactions TEXT, recipient_id varchar(255), sender_id varchar(255), voting TEXT, primary key (id)) engine=InnoDB;
create table request_message (id integer not null auto_increment, created_at datetime(6), content TEXT, recipient_id varchar(255), sender_id varchar(255), team_id varchar(255), primary key (id)) engine=InnoDB;
create table role (id integer not null auto_increment, role_name varchar(255), primary key (id)) engine=InnoDB;
create table team (auto_add_member bit, id varchar(255) not null, team_name varchar(255), url_icon varchar(255), primary key (id)) engine=InnoDB;
create table team_member (id varchar(255) not null, role varchar(255), team_id varchar(255), u_id varchar(255), primary key (id)) engine=InnoDB;
create table user (birthday date, is_activated bit, role_id integer, last_active datetime(6), otptime datetime(6), calendar_meeting_ids TEXT, email varchar(255) not null, id varchar(255) not null, nick_name varchar(255), otpcode varchar(255), password varchar(255), phone_number varchar(255), provider varchar(255), status varchar(255), url_icon varchar(255), primary key (id)) engine=InnoDB;
alter table user add constraint UK_ob8kqyqqgmefl0aco34akdtpe unique (email);
alter table channel add constraint FK63ug4lh1q6hpxuyqhbs6xm1v8 foreign key (team_id) references team (id);
alter table friend_relation add constraint FKmatnqyj8jw40dbbtot5r3sb5g foreign key (friend1id) references user (id);
alter table friend_relation add constraint FKgu2p55c56acoat5a722x7xfy3 foreign key (friend2id) references user (id);
alter table request_message add constraint FKehcv7bl7n9ukmwywym8rqltd foreign key (recipient_id) references user (id);
alter table request_message add constraint FK99wgcsvrb8x8lpta52o87sa07 foreign key (sender_id) references user (id);
alter table request_message add constraint FK6wwioc8pydletyq16k3wyv6kh foreign key (team_id) references team (id);
alter table team_member add constraint FK9ubp79ei4tv4crd0r9n7u5i6e foreign key (team_id) references team (id);
alter table team_member add constraint FKq5cajxrxxx7x4sytrwxhffhon foreign key (u_id) references user (id);
alter table user add constraint FKn82ha3ccdebhokx3a8fgdqeyy foreign key (role_id) references role (id);
