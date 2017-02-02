# sc-messages
Notification messages which will be used by [Khabar](https://github.com/biulletind/khabar).
Settings can be managed by [Khabar-Admin](https://github.com/biulletind/khabar-admin).

Most topics will be sent by email, most will show up in the web as well, few will also have a push message.

## Actionapp
* action_assigned
* action_completed
* incident_action_completed
* action_accepted
* action_rejected

## Inspectionapp
* inspection_template_assigned
* inspection_completed
* inspection_completed_report
* inspection_template_clone

## Observationapp
* log_used
* log_archived
* incident_assigned
* incident_contribution
* log_incoming
* high_prio_log_incoming
* publication_incoming
* inspection_log_incoming
* inspection_high_prio_log_incoming

## Shared
* generic
* export
* import_users
* password_new
* password_reset

## Email structure
`email/base.tmpl` contains structure and styling.
Each email needs apart from the topic translation, an entry for the `subject` and one for `linktext`.
When both `linktext` and `destination_uri` (from context) are provided, a link button is shown.
```json
{
  "id": "action_completed",
  "translation": "The action <strong>{{.action_title}}</strong> was just completed by <strong>{{.assignee}}</strong>."
},
{
  "id": "action_completed_subject",
  "translation": "Action completed"
},
{
  "id": "action_completed_linktext",
  "translation": "View completed action"
},
```

## Example email
![screen shot 2017-01-27 at 13 14 47](https://cloud.githubusercontent.com/assets/2291242/22370833/ce31a18a-e493-11e6-91e4-6c506af05d86.png)
