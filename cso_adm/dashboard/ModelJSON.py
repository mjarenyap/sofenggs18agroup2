from django.contrib.auth.models import User
from dashboard.models import PostActsLog, Organization, Map

def get_all_log_json():
    logs_set = "["
    for log in PostActsLog.objects.all():
        logs_set = logs_set + str(log.getJSON2())
    if len(logs_set) > 1:
        logs_set = logs_set[:-1]
    logs_set = logs_set + "]"
    print("JSON for Logs: " + logs_set)

    return logs_set


def get_all_org_json():
    organization_set = "["
    for org in Organization.objects.all():
        organization_set = organization_set + str(org.getJSON2())
    if len(organization_set) > 1:
        organization_set = organization_set[:-1]
    organization_set = organization_set + "]"
    print("JSON for Organizations: " + organization_set)

    return organization_set


def get_all_cluster_json():
    clusters_set = "["
    clusters_set = clusters_set + "{\"short\":\"ASO\",\"long\":\"Alliance of Science Organizations\"},"
    clusters_set = clusters_set + "{\"short\":\"ASPIRE\",\"long\":\"Alliance of Special Interest and Socio-Civic Organizations\"},"
    clusters_set = clusters_set + "{\"short\":\"CAP 12\",\"long\":\"College of Liberal Arts Professional Organizations\"},"
    clusters_set = clusters_set + "{\"short\":\"ENGAGE\",\"long\":\"Engineering Alliance Geared Towards Excellence\"},"
    clusters_set = clusters_set + "{\"short\":\"PROBE\",\"long\": \"Alliance of Professional Organizations of Business and Economics\"}"
    clusters_set = clusters_set + "{\"short\":\"OTHERS\",\"long\":\"Others\"}]"
    print("JSON for Cluster: " + clusters_set)

    return clusters_set


def get_all_type_json():
    type_set = "[[{'short':'P','long':'Pended'},{'short':'IS','long':'Initial Submission'}]"
    print("JSON for Type: " + type_set)

    return type_set


def get_all_status_set():
    status_set = "["
    status_set = status_set + "{'short':'P','long':'Pending'},"
    status_set = status_set + "{'short':'EC','long':'Early Complete'},"
    status_set = status_set + "{'short':'LC','long':'Late Complete'},"
    status_set = status_set + "{'short':'EI','long':'Early Incomplete'},"
    status_set = status_set + "{'short':'LI','long':'Late Incomplete'},"
    status_set = status_set + "{'short':'AC','long':'Acknowledged Cancellation'}]"
    print("JSON for Status: " + status_set)

    return status_set


def get_all_moderator_json():
    mod_set = "["
    mods = User.objects.filter(groups__name='moderator')
    for mod in mods:
        mod_set = mod_set + "\"" + mod.get_full_name() + "\","
    if len(mod_set) > 1:
        mod_set = mod_set[:-1]
    mod_set = mod_set + "]"
    print("JSON for Moderators: " + mod_set)

    return mod_set