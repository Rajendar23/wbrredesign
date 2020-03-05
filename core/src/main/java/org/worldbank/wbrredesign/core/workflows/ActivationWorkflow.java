package org.worldbank.wbrredesign.core.workflows;

import java.util.Collections;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.social.community.api.CommunityConstants;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.replication.Replicator;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;

@Component(service = WorkflowProcess.class, property = { "process.label=WB Activation Workflow Process" })
public class ActivationWorkflow implements WorkflowProcess {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	private static final String HTML_PATTERN = "<(\"[^\"]*\"|'[^']*'|[^'\">])*>";

	@Reference
	ResourceResolverFactory resourceResolverFactory;

	@Reference
	Replicator replicator;

	@Override
	public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap)
			throws WorkflowException {
		try {
			WorkflowData data = workItem.getWorkflowData();
			String payload = (String) data.getPayload();
			Session session = workflowSession.getSession();
			ResourceResolver resourceResolver = getResourceResolver(session);

			Resource resource = resourceResolver.getResource(payload);
			recursive(resource, session);
			session.save();
		} catch (Exception e) {

		}
	}

	public void recursive(Resource resource, Session session) {
		try {
			Resource childResource;
			String propertyKey;
			Object propertyValue;
			Iterator<Resource> children = resource.listChildren();

			if (resource.getResourceType().equals(NameConstants.NT_PAGE)) {
				replciate(session, resource.getPath());
			}

			while (children.hasNext()) {
				childResource = children.next();

				if (!childResource.getName().equals("root") && !childResource.getName().equals("responsivegrid")) {
					ValueMap property = childResource.adaptTo(ValueMap.class);
					for (Entry<String, Object> e : property.entrySet()) {
						propertyKey = e.getKey();
						propertyValue = e.getValue();
						if (!propertyKey.startsWith("jcr:") && !propertyKey.startsWith("cq:")
								&& !propertyKey.contains("sling:")) {

							if (hasHTMLTags(propertyValue.toString())) {
								Document doc = Jsoup.parse(propertyValue.toString());
								Elements elements = doc.select("a");

								if (!elements.isEmpty()) {
									Iterator<Element> iterator = elements.iterator();

									while (iterator.hasNext()) {
										Element element = iterator.next();
										if (element.hasAttr("href")) {
											replciate(session, element.attr("href"));
										}

									}
								}
							} else if (propertyValue.toString().startsWith(CommunityConstants.DAM_ROOT_PATH)
									&& session.nodeExists(propertyValue.toString())) {
								replciate(session, propertyValue.toString());
							}
						}
					}
				}

				if (childResource.hasChildren()) {
					recursive(childResource, session);
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	public void replciate(Session session, String path) throws ReplicationException, RepositoryException {
		ReplicationStatus replicationStatus = replicator.getReplicationStatus(session, path);
		if (!replicationStatus.isActivated() && session.nodeExists(path)) {
			replicator.replicate(session, ReplicationActionType.ACTIVATE, path);
		}
	}

	private ResourceResolver getResourceResolver(Session session) throws LoginException {
		return resourceResolverFactory.getResourceResolver(
				Collections.<String, Object>singletonMap(JcrResourceConstants.AUTHENTICATION_INFO_SESSION, session));
	}

	public boolean hasHTMLTags(String text) {
		Pattern pattern = Pattern.compile(HTML_PATTERN);
		Matcher matcher = pattern.matcher(text);
		return matcher.find();
	}
}
