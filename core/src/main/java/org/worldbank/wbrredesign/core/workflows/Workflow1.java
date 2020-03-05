package org.worldbank.wbrredesign.core.workflows;

import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;

@Component(service = WorkflowProcess.class, property = { "process.label=Workflow1" })
public class Workflow1 implements WorkflowProcess {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void execute(WorkItem item, WorkflowSession session, MetaDataMap args) throws WorkflowException {
		try {
			logger.info("Workflow1");
		} catch (Exception e) {

		}

	}

}
