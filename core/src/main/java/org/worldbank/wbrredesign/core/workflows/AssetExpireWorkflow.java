package org.worldbank.wbrredesign.core.workflows;

import java.util.HashMap;
import java.util.Map;

import javax.jcr.Session;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;

@Component(service = WorkflowProcess.class, property = { "process.label=Asset Expire Workflow Process" })
public class AssetExpireWorkflow implements WorkflowProcess {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Reference
	private QueryBuilder queryBuilder;

	@Override
	public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap)
			throws WorkflowException {
		try {
			logger.info("Asset Expire Workflow Process");
			WorkflowData data = workItem.getWorkflowData();
			String payload = (String) data.getPayload();
			Session session = workflowSession.getSession();

			Map<String, String> params = new HashMap<>();
			params.put("type", DamConstants.NT_DAM_ASSET);
			params.put("path", payload);
			params.put("property", "@jcr:content/metadata/prism:expirationDate");
			params.put("property.operation", "exists");
			params.put("p.offset", "0");
			params.put("p.limit", "-1");

			Query query = queryBuilder.createQuery(PredicateGroup.create(params), session);
			SearchResult result = query.getResult();
			logger.info(query.getResult().getHits().size() + " total assets");
			for (Hit hit : result.getHits()) {
				String path = hit.getPath();
				logger.info(path);
			}

		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}
}
