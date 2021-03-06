from __future__ import absolute_import, print_function

from django.core.urlresolvers import reverse
from exam import fixture

from sentry import tagstore
from sentry.testutils import TestCase


class ProjectTagsTest(TestCase):
    @fixture
    def path(self):
        return reverse(
            'sentry-manage-project-tags', args=[self.organization.slug, self.project.slug]
        )

    def test_requires_authentication(self):
        self.assertRequiresAuthentication(self.path)

    def test_simple(self):
        tagstore.create_tag_key(project_id=self.project.id, key='site')
        tagstore.create_tag_key(project_id=self.project.id, key='url')
        tagstore.create_tag_key(project_id=self.project.id, key='os')

        self.login_as(self.user)

        resp = self.client.get(self.path)
        assert resp.status_code == 200
        self.assertTemplateUsed('sentry/projects/manage_tags.html')
        assert resp.context['organization'] == self.organization
        assert resp.context['team'] == self.team
        assert resp.context['project'] == self.project
        tag_list = [t.key for t in resp.context['tag_list']]
        assert 'site' in tag_list
        assert 'url' in tag_list
        assert 'os' in tag_list
