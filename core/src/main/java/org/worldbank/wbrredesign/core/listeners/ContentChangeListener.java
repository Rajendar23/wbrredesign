package org.worldbank.wbrredesign.core.listeners;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.observation.ResourceChange;
import org.apache.sling.api.resource.observation.ResourceChangeListener;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.asset.api.AssetManager;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.workflow.WorkflowService;

@Component(service = ResourceChangeListener.class, property = { ResourceChangeListener.PATHS + "=" + "/content/dam",
		ResourceChangeListener.CHANGES + "=" + "ADDED" })
public class ContentChangeListener implements ResourceChangeListener {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Reference
	private WorkflowService workflowService;

	@Reference
	private ResourceResolverFactory resolverFactory;

	@Reference
	private QueryBuilder queryBuilder;

	static final Integer ASSET_LIMIT = 5;

	@Override
	public void onChange(List<ResourceChange> changes) {
		Map<String, Object> param = new HashMap<>();
		param.put(ResourceResolverFactory.SUBSERVICE, "datawrite");

		try {
			ResourceResolver resourceResolver = resolverFactory.getServiceResourceResolver(param);
			AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
			Session session = resourceResolver.adaptTo(Session.class);

			changes.forEach(change -> {
				String filePath = change.getPath(), damPath = null, fileName = null;
				if (StringUtils.isNotBlank(FilenameUtils.getExtension(filePath))) {
					damPath = FilenameUtils.getFullPathNoEndSeparator(filePath);
					fileName = FilenameUtils.getBaseName(filePath);
					Integer damAssetCount = getAssetsCount(session, damPath);
					logger.info("start");
					logger.info(FilenameUtils.getBaseName(filePath));
					logger.info(FilenameUtils.getName(filePath));
					if (ASSET_LIMIT <= damAssetCount) {
						damPath += "-1";
						try {
							if (session.itemExists(damPath)) {
								logger.info("if");
							} else {
								logger.info("else");
								final Map<String, Object> folderProperties = new HashMap<>();
								folderProperties.put(JcrConstants.JCR_PRIMARYTYPE, "sling:OrderedFolder");
								resourceResolver.create(
										resourceResolver.getResource(damPath.substring(0, damPath.lastIndexOf('/'))),
										damPath.substring(damPath.lastIndexOf('/') + 1, damPath.length()),
										folderProperties);
								session.save();
								assetManager.moveAsset(filePath, damPath + "/" + fileName);
							}
						} catch (RepositoryException | PersistenceException e) {
							logger.error(e.getMessage());
						}
					}
					logger.info(filePath);
					logger.info("end");
				}
			});
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	private Integer getAssetsCount(Session session, String contentPath) {
		Map<String, String> params = new HashMap<>();
		params.put("type", DamConstants.NT_DAM_ASSET);
		params.put("path", contentPath);
		params.put("p.offset", "0");
		params.put("p.limit", "-1");

		Query query = queryBuilder.createQuery(PredicateGroup.create(params), session);
		return query.getResult().getHits().size();
	}
}
