# dashboard/apps.py must have utility.sync commented out!

# Test Suites
from django.test import TestCase, RequestFactory

# Utility imports
import json
from datetime import datetime

# Django auth/admin imports
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View
from django.db import models
from django.urls.exceptions import NoReverseMatch

# Dashboard Imports
from dashboard import utility
from dashboard.utility import sync
from dashboard.views import get_response_context, get_log, save_post_acts, UserFormView
from dashboard.models import PostActsLog, Organization


# Unit Tests for the Organization model
class OrganizationTestCases(TestCase):
    def setUp(self):
        Organization.objects.create(name="La Salle Computer Society", shortname="LSCS", cluster="CCS")

    # Tests proper JSON generation
    def test_org_json(self):
        lscs = Organization.objects.get(name="La Salle Computer Society")
        expected_json = '{\\\"short\\\":\\\"LSCS\\\",\\\"long\\\":\\\"La Salle Computer Society\\\",\\\"cluster\\\":\\\"CCS\\\"},'
        self.assertEqual(lscs.getJSON(), expected_json)

    # Tests that model should not accept non escape sequences
    def test_org_json_nonescape(self):
        lscs = Organization.objects.get(name="La Salle Computer Society")
        expected_json = '{\"short\":\"LSCS\",\"long\":\"La Salle Computer Society\",\"cluster\":\"CCS\"},'
        self.assertNotEqual(lscs.getJSON(), expected_json)

    # Tests proper JSON2 generation
    def test_org_json2(self):
        lscs = Organization.objects.get(name="La Salle Computer Society")
        expected_json2 = '{\"short\":\"LSCS\",\"long\":\"La Salle Computer Society\",\"cluster\":\"CCS\"},'
        self.assertEqual(lscs.getJSON2(), expected_json2)

    # Tests that model should not respond to escaped characters
    def test_org_json2_non_escape(self):
        lscs = Organization.objects.get(name="La Salle Computer Society")
        expected_json2 = '{\\\"short\\\":\\\"LSCS\\\",\\\"long\\\":\\\"La Salle Computer Society\\\",\\\"cluster\\\":\\\"CCS\\\"},'
        self.assertNotEqual(lscs.getJSON2(), expected_json2)


# Unit Tests for the PostActLogs model
class PostActsLogTestCases(TestCase):
    def setUp(self):
        PostActsLog.objects.create(row_number=1,
                                   timestamp="01/01/2000", activity_title="Test Activity", term="1",
                                   organization="LSCS", tie_up_orgs="", submission_type="",
                                   enp="1", anp="1", enmp="1", anmp="1", expenses_incurred="0",
                                   submitted_by="Blaise Cruz", contact_no="09282880452",
                                   email="jan_christian_cruz@dlsu.edu.ph", status="Pending", checked_by="Hordy Mojica",
                                   date_checked="01/01/2000",
                                   remarks="None")

    # Tests proper JSON output
    def test_log_json(self):
        activity = PostActsLog.objects.get(activity_title="Test Activity")
        expected_json = '{\\\"id\\\":1,\\\"t\\\":\\\"01/01/2000\\\",\\\"n\\\":\\\"Test Activity\\\",\\\"o\\\":\\\"LSCS\\\",\\\"term\\\":\\\"1\\\",\\\"st\\\":\\\"\\\",\\\"s\\\":\\\"Pending\\\",\\\"cb\\\":\\\"Hordy Mojica\\\",\\\"d\\\":\\\"01/01/2000\\\"},'
        self.assertEqual(activity.getJSON(), expected_json)

    # Tests that model should not respond to non escape sequences
    def test_log_json_non_escape(self):
        activity = PostActsLog.objects.get(activity_title="Test Activity")
        expected_json = '{\"id\":1,\"t\":\"01/01/2000\",\"n\":\"Test Activity\",\"o\":\"LSCS\",\"term\":\"1\",\"st\":\"\",\"s\":\"Pending\",\"cb\":\"Hordy Mojica\",\"d\":\"01/01/2000\"},'
        self.assertNotEqual(activity.getJSON(), expected_json)

    # Tests proper JSON2 output
    def test_log_json2(self):
        activity = PostActsLog.objects.get(activity_title="Test Activity")
        expected_json2 = '{"id":1,"t":"01/01/2000","n":"Test Activity","o":"LSCS","term":"1","st":"","s":"Pending","cb":"Hordy Mojica","d":"01/01/2000"},'
        self.assertEqual(activity.getJSON2(), expected_json2)

    # Tests that JSON2 must not respond to non escape characters
    def test_log_json2_non_escape(self):
        activity = PostActsLog.objects.get(activity_title="Test Activity")
        expected_json2 = '{"id":1,"t":"01//01//2000","n":"Test Activity","o":"LSCS","term":"1","st":"","s":"Pending","cb":"Hordy Mojica","d":"01//01//2000"},'
        self.assertNotEqual(activity.getJSON2(), expected_json2)

    # Tests that an absolute URL cannot be taken isolated from the dashboard ecosystem
    def test_absolute_url(self):
        activity = PostActsLog.objects.get(activity_title="Test Activity")
        self.assertRaises(NoReverseMatch, activity.get_absolute_url)


class UtilityTestCases(TestCase):
    def setUp(self):
        pass


class ViewTestCases(TestCase):
    # Create a post act log
    def setUp(self):
        PostActsLog.objects.create(row_number=1,
                                   timestamp="01/01/2000", activity_title="Test Activity", term="1",
                                   organization="LSCS", tie_up_orgs="", submission_type="",
                                   enp="1", anp="1", enmp="1", anmp="1", expenses_incurred="0",
                                   submitted_by="Blaise Cruz", contact_no="09282880452",
                                   email="jan_christian_cruz@dlsu.edu.ph", status="Pending", checked_by="Hordy Mojica",
                                   date_checked="01/01/2000",
                                   remarks="None")
        self.factory = RequestFactory()

    # Tests that an http response can be made
    def test_get_response_context(self):
        res = get_response_context(None)
        self.assertIsInstance(res, HttpResponse)

    # Tests that an http response has the 200 status code
    def test_get_response_context_status(self):
        res = get_response_context(None)
        self.assertEqual(res.status_code, 200)

    # Tests if the right content was loaded in the response header
    def test_get_response_context_content(self):
        expected_res = get_response_context(None).content
        res = get_response_context(None)
        self.assertEqual(expected_res, res.content)

    # Tests that get_log should always have a request
    def test_get_log_empty(self):
        request = self.factory.get('id/1')
        self.assertIsInstance(get_log(request), HttpResponse)

    # Tests that save_post_acts should always have a request
    def test_save_post_acts_empty(self):
        request = self.factory.post('id/1')
        request.user = User.objects.create_user(username="admin")
        self.assertIsInstance(save_post_acts(request), HttpResponse)


# Test cases for the UserFormView View class
class UserFormViewTestcases(TestCase):
    def setUp(self):
        PostActsLog.objects.create(row_number=1,
                                   timestamp="01/01/2000", activity_title="Test Activity", term="1",
                                   organization="LSCS", tie_up_orgs="", submission_type="",
                                   enp="1", anp="1", enmp="1", anmp="1", expenses_incurred="0",
                                   submitted_by="Blaise Cruz", contact_no="09282880452",
                                   email="jan_christian_cruz@dlsu.edu.ph", status="Pending", checked_by="Hordy Mojica",
                                   date_checked="01/01/2000",
                                   remarks="None")
        self.factory = RequestFactory()

    # Tests that a UserFormView can process form data
    def test_user_form_view_post(self):
        cs = UserFormView()
        request = self.factory.post('id/1')
        self.assertIsInstance(cs.post(request), HttpResponse)
