package org.worldbank.wbrredesign.core.workflows;

import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.HistoryItem;
import com.adobe.granite.workflow.exec.ParticipantStepChooser;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.Workflow;
import com.adobe.granite.workflow.metadata.MetaDataMap;

@Component(service = ParticipantStepChooser.class, property = { "chooser.label=WB Dynamic Participant Step" })
public class DynamicStep implements ParticipantStepChooser {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public String getParticipant(WorkItem workItem, WorkflowSession wfSession, MetaDataMap metaDataMap)
			throws WorkflowException {
		logger.info(
				"################ Inside the SampleProcessStepChooserImpl GetParticipant ##########################");
		String participant = "admin";
		Workflow wf = workItem.getWorkflow();
		List<HistoryItem> wfHistory = wfSession.getHistory(wf);
		if (!wfHistory.isEmpty()) {
			participant = "administrators";
		} else {
			participant = "admin";
		}
		logger.info("####### Participant : " + participant + " ##############");
		return participant;
	}

}
